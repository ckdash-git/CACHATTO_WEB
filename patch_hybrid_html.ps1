$htmlPath = 'c:\Users\Chandan S\Downloads\Cachatto_web\CACHATTO_WEB\index.html'
$html = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)

# Find the section start and end
$startMarker = '<section class="section hybrid-platform" id="hybrid" aria-labelledby="hybridTitle">'
$endMarker   = '</section>'

$startIdx = $html.IndexOf($startMarker)
if ($startIdx -lt 0) { Write-Host "ERROR: start not found"; exit 1 }

# Find the closing </section> after the start
$endIdx = $html.IndexOf($endMarker, $startIdx)
if ($endIdx -lt 0) { Write-Host "ERROR: end not found"; exit 1 }
$endIdx += $endMarker.Length   # include the </section> itself

$before = $html.Substring(0, $startIdx)
$after  = $html.Substring($endIdx)

$newSection = @'
<section class="section hybrid-platform" id="hybrid" aria-labelledby="hybridTitle">
    <div class="container">

      <!-- Centered header -->
      <div class="hybrid-header">
        <p class="hybrid-eyebrow">Anytime, anywhere, safely</p>
        <h2 class="hybrid-title" id="hybridTitle">
          Integrated management and operation of<br>multiple PC-based business tools on the cloud.
        </h2>
        <div class="hybrid-rule" aria-hidden="true"></div>
      </div>

      <!-- Two-column body -->
      <div class="hybrid-body fade-up">

        <!-- Left: illustration + floating badge -->
        <div class="hybrid-image">
          <img
            src="Assets/concept_cachatto_2.png"
            alt="CACHATTO hybrid work platform people working across devices from any location"
            loading="lazy"
          />
          <div class="hybrid-image-badge" aria-hidden="true">
            <div class="badge-icon">
              <span class="material-symbols-outlined">verified_user</span>
            </div>
            <div class="badge-text">
              <strong>3,000+ Organizations</strong>
              <span>Trust CACHATTO globally</span>
            </div>
          </div>
        </div>

        <!-- Right: intro + feature cards -->
        <div class="hybrid-content">
          <p class="hybrid-intro">
            CACHATTO One is a hybrid work platform that provides multiple types of PC-based business
            tools, secure communication methods, and cloud/on-premise integration in one place enabling
            integrated management on the cloud so employees can work securely from anywhere.
          </p>

          <div class="hybrid-cards">
            <div class="hybrid-card">
              <div class="hybrid-card__icon" aria-hidden="true">
                <span class="material-symbols-outlined">public</span>
              </div>
              <h3 class="hybrid-card__title">Anywhere Access</h3>
              <p class="hybrid-card__desc">Work securely from any location, device, or network with no data left on endpoints.</p>
            </div>
            <div class="hybrid-card">
              <div class="hybrid-card__icon" aria-hidden="true">
                <span class="material-symbols-outlined">security</span>
              </div>
              <h3 class="hybrid-card__title">Secure Tools</h3>
              <p class="hybrid-card__desc">Multiple business tools delivered securely via the cloud with policy-based access control.</p>
            </div>
            <div class="hybrid-card">
              <div class="hybrid-card__icon" aria-hidden="true">
                <span class="material-symbols-outlined">cloud_sync</span>
              </div>
              <h3 class="hybrid-card__title">Cloud and On-Prem</h3>
              <p class="hybrid-card__desc">Seamless integration of cloud-hosted and on-premise systems under one management console.</p>
            </div>
            <div class="hybrid-card">
              <div class="hybrid-card__icon" aria-hidden="true">
                <span class="material-symbols-outlined">dashboard</span>
              </div>
              <h3 class="hybrid-card__title">One Platform</h3>
              <p class="hybrid-card__desc">Unified administration, monitoring, and user lifecycle management across all tools.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
'@

$newHtml = $before + $newSection + $after
[System.IO.File]::WriteAllText($htmlPath, $newHtml, [System.Text.Encoding]::UTF8)
Write-Host "Done. Total chars: $($newHtml.Length)"
