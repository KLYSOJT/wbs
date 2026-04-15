$files = @(
  "src/js/user/school-memo.js",
  "src/js/user/division-memo.js",
  "src/js/user/deped-memo.js",
  "src/js/user/deped-order.js",
  "src/js/user/app.js",
  "src/js/user/award-contracts.js",
  "src/js/user/bac.js",
  "src/js/user/bid-bulletin.js",
  "src/js/user/invitation-bid.js",
  "src/js/user/philgeps.js",
  "src/js/user/procurement-reports.js",
  "src/js/user/spta.js",
  "src/js/user/sslg.js",
  "src/js/user/bsp.js",
  "src/js/user/gsp.js",
  "src/js/user/tr.js",
  "src/js/user/mooe.js",
  "src/js/user/redcross.js",
  "src/js/admin/school-memo.js",
  "src/js/admin/division-memo.js",
  "src/js/admin/deped-memo.js",
  "src/js/admin/deped-order.js",
  "src/js/admin/app.js",
  "src/js/admin/award-contracts.js",
  "src/js/admin/bac.js",
  "src/js/admin/bid-bulletin.js",
  "src/js/admin/invitation-bid.js",
  "src/js/admin/philgeps.js",
  "src/js/admin/procurement-reports.js",
  "src/js/admin/spta.js",
  "src/js/admin/sslg.js",
  "src/js/admin/bsp.js",
  "src/js/admin/gsp.js",
  "src/js/admin/tr.js",
  "src/js/admin/mooe.js",
  "src/js/admin/redcross.js"
)

$adminPattern = 'function renderPagination\(\) \{[\s\S]*?function createPaginationButton\(label, page, isActive = false\) \{[\s\S]*?return button;\r?\n\}'
$userPattern = 'function renderPagination\(\) \{[\s\S]*?function createPaginationButton\(label, page, isActive = false\) \{[\s\S]*?return button;\r?\n\}'

$adminReplacement = @"
function renderPagination() {
  const pagination = document.querySelector('#paginationControls');
  if (!pagination) return;

  pagination.innerHTML = '';

  const totalPages = getTotalPages();
  if (memoTableState.filteredMemos.length === 0 || totalPages <= 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createPaginationButton('<', memoTableState.currentPage - 1, {
      isDisabled: memoTableState.currentPage === 1,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Previous page'
    })
  );

  buildPaginationItems(totalPages, memoTableState.currentPage).forEach((item) => {
    if (item === 'ellipsis') {
      fragment.appendChild(createPaginationEllipsis());
      return;
    }

    fragment.appendChild(
      createPaginationButton(String(item), item, {
        isActive: item === memoTableState.currentPage,
        ariaLabel: 'Page ' + item
      })
    );
  });

  fragment.appendChild(
    createPaginationButton('>', memoTableState.currentPage + 1, {
      isDisabled: memoTableState.currentPage === totalPages,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Next page'
    })
  );

  pagination.appendChild(fragment);
}

function buildPaginationItems(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) {
    startPage = 2;
    endPage = 5;
  } else if (currentPage >= totalPages - 3) {
    startPage = totalPages - 4;
    endPage = totalPages - 1;
  }

  if (startPage > 2) {
    items.push('ellipsis');
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < totalPages - 1) {
    items.push('ellipsis');
  }

  items.push(totalPages);

  return items;
}

function createPaginationButton(label, page, options = {}) {
  const {
    isActive = false,
    isDisabled = false,
    extraClass = '',
    ariaLabel = label
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pagination-btn' + (isActive ? ' active' : '') + (extraClass ? ' ' + extraClass : '');
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);

  if (isActive) {
    button.setAttribute('aria-current', 'page');
  }

  if (isDisabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    return button;
  }

  button.addEventListener('click', () => {
    memoTableState.currentPage = page;
    renderTable();
    renderPagination();
  });

  return button;
}

function createPaginationEllipsis() {
  const ellipsis = document.createElement('span');
  ellipsis.className = 'pagination-ellipsis';
  ellipsis.textContent = '...';
  ellipsis.setAttribute('aria-hidden', 'true');
  return ellipsis;
}
"@

$userReplacementTemplate = @"
function renderPagination() {
  const pagination = __ELEMENTS__.pagination;
  if (!pagination) return;

  pagination.innerHTML = '';

  const totalPages = Math.ceil(__STATE__.filteredRecords.length / __STATE__.pageSize);
  if (totalPages <= 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createPaginationButton('<', __STATE__.currentPage - 1, {
      isDisabled: __STATE__.currentPage === 1,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Previous page'
    })
  );

  buildPaginationItems(totalPages, __STATE__.currentPage).forEach((item) => {
    if (item === 'ellipsis') {
      fragment.appendChild(createPaginationEllipsis());
      return;
    }

    fragment.appendChild(
      createPaginationButton(String(item), item, {
        isActive: item === __STATE__.currentPage,
        ariaLabel: 'Page ' + item
      })
    );
  });

  fragment.appendChild(
    createPaginationButton('>', __STATE__.currentPage + 1, {
      isDisabled: __STATE__.currentPage === totalPages,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Next page'
    })
  );

  pagination.appendChild(fragment);
}

function buildPaginationItems(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) {
    startPage = 2;
    endPage = 5;
  } else if (currentPage >= totalPages - 3) {
    startPage = totalPages - 4;
    endPage = totalPages - 1;
  }

  if (startPage > 2) {
    items.push('ellipsis');
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < totalPages - 1) {
    items.push('ellipsis');
  }

  items.push(totalPages);

  return items;
}

function createPaginationButton(label, page, options = {}) {
  const {
    isActive = false,
    isDisabled = false,
    extraClass = '',
    ariaLabel = label
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pagination-btn' + (isActive ? ' active pagination-active' : '') + (extraClass ? ' ' + extraClass : '');
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);

  if (isActive) {
    button.setAttribute('aria-current', 'page');
  }

  if (isDisabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    return button;
  }

  button.addEventListener('click', () => {
    __STATE__.currentPage = page;
    renderTable();
    renderPagination();
  });

  return button;
}

function createPaginationEllipsis() {
  const ellipsis = document.createElement('span');
  ellipsis.className = 'pagination-ellipsis';
  ellipsis.textContent = '...';
  ellipsis.setAttribute('aria-hidden', 'true');
  return ellipsis;
}
"@

foreach ($file in $files) {
  $content = Get-Content -Path $file -Raw

  if ($file -like 'src/js/admin/*') {
    $updated = [regex]::Replace($content, $adminPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $adminReplacement }, 1)
    if ($updated -eq $content) { throw "Admin block not replaced: $file" }
    $content = $updated
  } else {
    $stateName = ([regex]::Match($content, 'const\s+(\w+State)\s*=')).Groups[1].Value
    $elementsName = ([regex]::Match($content, 'const\s+(\w+Elements)\s*=')).Groups[1].Value
    if (-not $stateName -or -not $elementsName) { throw "Names not found: $file" }

    $userReplacement = $userReplacementTemplate.Replace('__STATE__', $stateName).Replace('__ELEMENTS__', $elementsName)
    $updated = [regex]::Replace($content, $userPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $userReplacement }, 1)
    if ($updated -eq $content) { throw "User block not replaced: $file" }
    $content = $updated
  }

  Set-Content -Path $file -Value $content
}
