javascript:(function() {
    function extractItems() {
        const items = [];
        const products = document.querySelectorAll('.adbl-library-content-row');
        
        products.forEach(product => {
            const titleElement = product.querySelector('.bc-heading a');
            const title = titleElement ? titleElement.textContent.trim() : '';
            const link = titleElement?.href || '';
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
    
    if (items.length > 0) {
        // Create spreadsheet-friendly output
        const header = 'Title\tAuthor\tLink';
        const rows = items.map(item => `${item.title}\t${item.author}\t${item.link}`);
        const spreadsheetData = [header, ...rows].join('\n');
        
        // Copy to clipboard
        navigator.clipboard.writeText(spreadsheetData)
            .then(() => console.log('✅ Data copied to clipboard! Ready to paste into spreadsheet'))
            .catch(err => console.error('❌ Failed to copy to clipboard:', err));

        // Log as table in console
        console.table(items);
    } else {
        console.log('❌ No items found on this page');
    }
    
    console.log(`Total items found: ${items.length}`);
})(); 