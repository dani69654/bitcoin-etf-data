"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://farside.co.uk/bitcoin-etf-flow-all-data/');
        const html = yield response.text();
        const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const data = [];
        let rowMatch;
        while ((rowMatch = tableRowRegex.exec(html)) !== null) {
            const rowHtml = rowMatch[1];
            const cells = [];
            // Extract cells from the row
            let cellMatch;
            while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
                cells.push(cellMatch[1]);
            }
            if (cells.length > 0) {
                // First column = date, last column = total
                const dateCell = cells[0];
                const totalCell = cells[cells.length - 1];
                if (dateCell && totalCell) {
                    // Remove HTML tags and trim
                    const dateText = dateCell.replace(/<[^>]*>/g, '').trim();
                    let totalText = totalCell.replace(/<[^>]*>/g, '').trim();
                    // Handle negative values (in red and in parentheses)
                    if ((totalText === null || totalText === void 0 ? void 0 : totalText.includes('(')) && totalText.includes(')')) {
                        totalText = '-' + totalText.replace(/[()]/g, '');
                    }
                    // Remove commas from numbers
                    totalText = totalText === null || totalText === void 0 ? void 0 : totalText.replace(/,/g, '');
                    // Check if it's a valid date (contains numbers and letters)
                    if (totalText && dateText && dateText.match(/\d+\s+\w+\s+\d+/) && !isNaN(parseFloat(totalText))) {
                        data.push({
                            date: dateText,
                            total: parseFloat(totalText) * 1000000,
                        });
                    }
                }
            }
        }
        return data;
    });
}
