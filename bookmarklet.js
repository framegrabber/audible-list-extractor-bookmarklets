javascript:(function() {
    function extractItems() {
        const items = [];
        const products = document.querySelectorAll('.productListItem');
        
        products.forEach(product => {
            const titleElement = product.querySelector('.bc-size-headline3');
            const title = titleElement ? titleElement.textContent.trim() : '';
            const link = titleElement?.closest('a')?.href || '';
            const authorElement = product.querySelector('.authorLabel a');
            const author = authorElement ? authorElement.textContent.trim() : '';
            
            if (title && author) {
                items.push({title, author, link});
            }
        });
        
        return items;
    }

    console.log('Extracting items from current page...');
    const items = extractItems();
    
    // Create spreadsheet-friendly output
    const header = 'Title\tAuthor\tLink';
    const rows = items.map(item => `${item.title}\t${item.author}\t${item.link}`);
    const spreadsheetData = [header, ...rows].join('\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(spreadsheetData)
        .then(() => console.log('✓ Data copied to clipboard! Ready to paste into spreadsheet'))
        .catch(err => console.error('Failed to copy to clipboard:', err));
    
    // Log as table in console
    console.table(items);
    console.log(`Total items found: ${items.length}`);
})(); 