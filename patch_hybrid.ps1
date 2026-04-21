$cssPath = 'c:\Users\Chandan S\Downloads\Cachatto_web\CACHATTO_WEB\style.css'
$css = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

$startMarker = '.hybrid-platform {'
$endMarker   = '/* Marquee viewport clips the scrolling tracks */'

$startIdx = $css.IndexOf($startMarker)
$endIdx   = $css.IndexOf($endMarker)

if ($startIdx -lt 0) { Write-Host "ERROR: start marker not found"; exit 1 }
if ($endIdx   -lt 0) { Write-Host "ERROR: end marker not found";   exit 1 }

$before = $css.Substring(0, $startIdx)
$after  = $css.Substring($endIdx)

$newBlock = @'

/* === HYBRID WORK PLATFORM SECTION - Split + feature cards === */
.hybrid-platform {
  background: var(--c-bg-section);
  padding: var(--s9) var(--s3);
  position: relative;
  overflow: hidden;
}
.hybrid-platform::before {
  content: '';
  position: absolute;
  width: 560px; height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,87,184,0.08) 0%, transparent 70%);
  top: -100px; left: -100px;
  pointer-events: none;
}
.hybrid-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto var(--s8);
}
.hybrid-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--c-blue);
  background: rgba(0,87,184,0.09);
  border: 1px solid rgba(0,87,184,0.18);
  border-radius: var(--r-pill);
  padding: 5px 18px;
  margin-bottom: var(--s3);
}
.hybrid-title {
  font-size: clamp(24px, 3.4vw, 38px);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.5px;
  color: var(--c-navy);
  margin-bottom: var(--s3);
}
.hybrid-rule {
  width: 48px;
  height: 3px;
  background: var(--c-blue);
  border-radius: 2px;
  margin: 0 auto;
}
.hybrid-body {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: var(--s8);
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
}
.hybrid-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hybrid-image img {
  max-width: 100%;
  height: auto;
  border-radius: var(--r-xl);
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-lg);
}
.hybrid-image-badge {
  position: absolute;
  bottom: 28px;
  right: -24px;
  z-index: 2;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-md);
  white-space: nowrap;
}
.hybrid-image-badge .badge-icon {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--g-blue);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}
.hybrid-image-badge .badge-text strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--c-navy);
  line-height: 1.1;
}
.hybrid-image-badge .badge-text span {
  font-size: 11px;
  color: var(--c-text-muted);
}
.hybrid-content {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}
.hybrid-intro {
  font-size: 16px;
  line-height: 1.78;
  color: var(--c-text);
  margin: 0;
}
.hybrid-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s3);
  margin-top: var(--s2);
}
.hybrid-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: var(--s3);
  transition: box-shadow 0.22s ease, transform 0.22s ease;
}
.hybrid-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}
.hybrid-card__icon {
  width: 42px; height: 42px;
  border-radius: var(--r-md);
  background: var(--g-blue);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  margin-bottom: var(--s2);
  font-size: 20px;
}
.hybrid-card__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-navy);
  margin-bottom: 4px;
  line-height: 1.3;
}
.hybrid-card__desc {
  font-size: 12.5px;
  color: var(--c-text-muted);
  line-height: 1.6;
}
@media (max-width: 900px) {
  .hybrid-body { grid-template-columns: 1fr; gap: var(--s6); }
  .hybrid-image-badge { right: auto; left: 50%; transform: translateX(-50%); bottom: -20px; }
  .hybrid-image { padding-bottom: 36px; }
}
@media (max-width: 480px) {
  .hybrid-cards { grid-template-columns: 1fr; }
  .hybrid-image-badge { display: none; }
}

'@

$newCss = $before + $newBlock + $after
[System.IO.File]::WriteAllText($cssPath, $newCss, [System.Text.Encoding]::UTF8)
Write-Host "Done. File written. Total chars: $($newCss.Length)"
