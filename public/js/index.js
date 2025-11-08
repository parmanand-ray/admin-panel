function geturl(nameId, slugId) {
  const nameInput = document.getElementById(nameId);
  const slugInput = document.getElementById(slugId);

  if (!nameInput || !slugInput) return;

  nameInput.addEventListener('input', function() {
    const slug = this.value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-')         // spaces → dashes
      .replace(/-+/g, '-');         // collapse multiple dashes

    slugInput.value = slug;
  });
}



