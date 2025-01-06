javascript:(function() {
    function showToast(message, type = 'success') {
        // Create and style toast container
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            font-size: 16px;
            line-height: 1.5;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        `;
        
        // Add message with enhanced icon visibility
        const enhancedMessage = message.replace(
            /(✅|❌|📋|📝)/g, 
            '<span style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); margin-right: 4px;">$1</span>'
        );
        toast.innerHTML = enhancedMessage;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

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
    
    if (items.length > 0) {
        // Create spreadsheet-friendly output
        const header = 'Title\tAuthor\tLink';
        const rows = items.map(item => `${item.title}\t${item.author}\t${item.link}`);
        const spreadsheetData = [header, ...rows].join('\n');
        
        // Copy to clipboard
        navigator.clipboard.writeText(spreadsheetData)
            .then(() => {
                console.log('✅ Data copied to clipboard! Ready to paste into spreadsheet');
                showToast(`
                    ✅ Successfully extracted ${items.length} books!<br>
                    📋 Data is copied to your clipboard<br>
                    📝 Open a spreadsheet and paste
                `);
            })
            .catch(err => {
                console.error('❌ Failed to copy to clipboard:', err);
                showToast('❌ Failed to copy to clipboard', 'error');
            });
        
        // Log as table in console
        console.table(items);
    } else {
        console.log('❌ No items found on this page');
        showToast('❌ No items found on this page', 'error');
    }
    
    console.log(`Total items found: ${items.length}`);
})(); 