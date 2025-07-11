import puppeteer from 'puppeteer';

export default async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        const response = await page.goto('https://farside.co.uk/btc/', {
            waitUntil: 'networkidle2',
            timeout: 30000,
        });

        if (!response) {
            throw new Error('No resp');
        }

        // Extract ETF table data
        return await page.evaluate(() => {
            const rows = document.querySelectorAll('table tr');
            const data: { date: string; total: number }[] = [];

            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 0) {
                    // First column = date, last column = total
                    const dateCell = cells[0];
                    const totalCell = cells[cells.length - 1];

                    if (dateCell && totalCell) {
                        const dateText = dateCell.textContent?.trim();
                        let totalText = totalCell.textContent?.trim();

                        // Handle negative values (in red and in parentheses)
                        if (totalText?.includes('(') && totalText.includes(')')) {
                            totalText = '-' + totalText.replace(/[()]/g, '');
                        }

                        // Remove commas from numbers
                        totalText = totalText?.replace(/,/g, '');

                        // Check if it's a valid date (contains numbers and letters)
                        if (
                            totalText &&
                            dateText &&
                            dateText.match(/\d+\s+\w+\s+\d+/) &&
                            !isNaN(parseFloat(totalText))
                        ) {
                            data.push({
                                date: dateText,
                                total: parseFloat(totalText),
                            });
                        }
                    }
                }
            });

            return data;
        });
    } catch (e) {
        console.log('Error scraping bitcoin ETF data:', e);
    } finally {
        await browser.close();
    }
}
