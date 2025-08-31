// Utility to generate a rich multi-page PDF report for FullAnalysisPage
// Uses html2canvas to rasterize sections and jsPDF to compose the PDF

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helper to capture a DOM element to image (PNG data URL)
export async function captureElement(el, scale = 1.5, bg = '#ffffff') {
  if (!el) return null;
  try {
    // give the browser a chance to paint before capture
    await new Promise((r) => requestAnimationFrame(() => r()));

    // Clone node and rasterize SVGs for reliable chart capture
    const rect = el.getBoundingClientRect();
    const clone = el.cloneNode(true);

    const origSvgs = el.querySelectorAll('svg');
    const cloneSvgs = clone.querySelectorAll('svg');

    // Helper: convert an SVG element to PNG dataURL
    const base64EncodeUnicode = (str) =>
      btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode('0x' + p1)
        )
      );

    const svgToPng = async (svgEl, widthPx, heightPx) => {
      try {
        // Ensure proper namespace
        const svg = svgEl.cloneNode(true);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        // Serialize
        const xml = new XMLSerializer().serializeToString(svg);
        const svg64 = base64EncodeUnicode(xml);
        const imgSrc = `data:image/svg+xml;base64,${svg64}`;
        // Draw to canvas
        const img = new Image();
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          img.src = imgSrc;
        });
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(widthPx || img.width || 800));
        canvas.height = Math.max(1, Math.floor(heightPx || img.height || 600));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
      } catch (e) {
        console.warn('Failed to rasterize SVG', e);
        return null;
      }
    };

    for (let i = 0; i < cloneSvgs.length; i++) {
      const orig = origSvgs[i];
      const target = cloneSvgs[i];
      if (!orig || !target) continue;
      const bbox = orig.getBoundingClientRect();
      const png = await svgToPng(orig, bbox.width || orig.clientWidth, bbox.height || orig.clientHeight);
      if (png) {
        const img = document.createElement('img');
        img.src = png;
        img.style.width = `${bbox.width || orig.clientWidth || 600}px`;
        img.style.height = `${bbox.height || orig.clientHeight || 300}px`;
        target.parentNode.replaceChild(img, target);
      }
    }

    // Place clone in offscreen container for correct layout
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-10000px';
    wrapper.style.top = '0';
    wrapper.style.background = bg;
    wrapper.style.width = `${Math.max(320, Math.ceil(rect.width))}px`;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, {
      scale,
      backgroundColor: bg,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: Math.max(document.documentElement.scrollWidth, wrapper.offsetWidth),
    });

    document.body.removeChild(wrapper);
    return canvas.toDataURL('image/png');
  } catch (e) {
    console.warn('html2canvas capture failed for element', e);
    return null;
  }
}

// Layout helpers
function addTitle(doc, text) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(text, 14, 18);
}

function addSubtitle(doc, text, y) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(text, 14, y);
  doc.setTextColor(0);
}

function addFooter(doc, page, total) {
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`H2-Optimize • Generated ${new Date().toLocaleString()} • Page ${page}/${total}`, 14, 290);
  doc.setTextColor(0);
}

// Exporter contract
// inputs:
// - sections: { key, ref, title, subtitle }[] elements to render (charts, cards, etc.)
// - meta: { locationName, coords, overallScore, riskLevel }
// - filename: string
// behavior: captures each section, auto-scales to page width, paginates, inserts headings and footer
export async function exportPDF({ sections, meta, filename = 'H2-Optimize-Report.pdf' }) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 22; // current y cursor

  // Cover/Header
  addTitle(doc, `H₂-Optimize Investment Report`);
  addSubtitle(doc, `${meta?.locationName || 'Selected Location'} • ${meta?.coords || ''}`, 26);
  addSubtitle(doc, `Viability Score: ${meta?.overallScore ?? '-'} • Risk: ${meta?.riskLevel ?? '-'}`, 32);
  y = 40;

  // Iterate sections
  const images = [];
  for (const s of sections || []) {
    try {
      if (s?.dataUrl) {
        images.push({ ...s });
        continue;
      }
      const el = s?.ref?.current || s?.ref; // supports both ref object and element
      const dataUrl = await captureElement(el);
      if (dataUrl) {
        images.push({ ...s, dataUrl });
      } else {
        console.warn('Skipping section due to capture error or empty ref:', s?.key || s?.title);
      }
    } catch (e) {
      console.warn('Section capture failed, skipping:', s?.key || s?.title, e);
    }
  }

  // Helper: add an image with pagination if taller than page
  async function addImagePaginated(dataUrl) {
    // Load image to know true pixel size
    const imgEl = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = dataUrl;
    });

    const origW = imgEl.width;
    const origH = imgEl.height;
    const imgWmm = pageWidth - margin * 2;
    const scale = imgWmm / origW;
    const pageAvailMm = pageHeight - margin - y; // remaining space on current page
    const pageAvailPxFirst = Math.floor(pageAvailMm / scale);
    const fullPageAvailPx = Math.floor((pageHeight - margin * 2) / scale);

    // Offscreen canvas for slicing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let offsetPx = 0;
    let isFirstSlice = true;
    while (offsetPx < origH) {
      const slicePx = Math.min(
        isFirstSlice ? Math.max(pageAvailPxFirst, 0) : fullPageAvailPx,
        origH - offsetPx
      );

      if (slicePx <= 0) {
        // no space left on this page; move to next
        addFooter(doc, pageCount, '');
        doc.addPage();
        pageCount += 1;
        y = margin;
        isFirstSlice = false;
        continue;
      }

      canvas.width = origW;
      canvas.height = slicePx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgEl, 0, offsetPx, origW, slicePx, 0, 0, origW, slicePx);
      const sliceUrl = canvas.toDataURL('image/png');

      const sliceHmm = slicePx * scale; // height in mm for this slice
      // If even this slice won't fit on current page (should not happen for first slice case), add new page
      if (y + sliceHmm > pageHeight - margin) {
        addFooter(doc, pageCount, '');
        doc.addPage();
        pageCount += 1;
        y = margin;
      }

      doc.addImage(sliceUrl, 'PNG', margin, y, imgWmm, sliceHmm, '', 'FAST');
      y += sliceHmm + 2; // small spacing between slices

      offsetPx += slicePx;
      isFirstSlice = false;

      // If next slice remains but no space left, move to new page
      if (offsetPx < origH && y > pageHeight - margin - 5) {
        addFooter(doc, pageCount, '');
        doc.addPage();
        pageCount += 1;
        y = margin;
      }
    }
  }

  // Helper to draw section header with pagination
  function drawSectionHeader(title, subtitle) {
    const headingHeight = subtitle ? 12 : 8;
    if (y + headingHeight > pageHeight - margin) {
      addFooter(doc, pageCount, '');
      doc.addPage();
      pageCount += 1;
      y = margin;
    }
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    if (title) doc.text(title, margin, y);
    y += subtitle ? 6 : 4;
    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(90);
      doc.text(subtitle, margin, y);
      doc.setTextColor(0);
      y += 4;
    }
  }

  // Render sections: one component per page (start each on a new page)
  let pageCount = 1;
  let isFirstSection = true;
  for (const { title, subtitle, dataUrl } of images) {
    // Move to a fresh page for each component
    if (isFirstSection) {
      // finish cover page
      addFooter(doc, pageCount, '');
      doc.addPage();
      pageCount += 1;
      y = margin;
      isFirstSection = false;
    } else {
      addFooter(doc, pageCount, '');
      doc.addPage();
      pageCount += 1;
      y = margin;
    }

    drawSectionHeader(title, subtitle);

  // Add image with pagination so full content is included
  await addImagePaginated(dataUrl);
    y += 6; // spacing after a section
  }

  if (images.length === 0) {
    // Fallback summary page if nothing was captured
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('No visual sections could be captured. This summary contains key metadata:', margin, y);
    y += 8;
    const metaLines = [
      `Location: ${meta?.locationName || ''}`,
      `Coordinates: ${meta?.coords || ''}`,
      `Viability Score: ${meta?.overallScore ?? '-'}`,
      `Risk Level: ${meta?.riskLevel || '-'}`,
    ];
    metaLines.forEach((line) => {
      if (y > pageHeight - margin) {
        addFooter(doc, pageCount, '');
        doc.addPage();
        pageCount += 1;
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    });
  }

  // Footer on last page
  addFooter(doc, pageCount, pageCount);

  // Save
  doc.save(filename);
}

export default exportPDF;
