// Insecure Design Challenge - Race condition vulnerability
(function() {
    const flag = 'CTF{R4c3_C0nd17i0n_Expl01t3d}';
    
    // Insecure design: balance stored in variable (should be server-side)
    let balance = 100;
    const itemCost = 150;
    let flagRevealed = false;
    
    // Vulnerable purchase function with race condition
    window.makePurchase = function() {
        // Race condition: check and deduct are separate operations
        if (balance >= itemCost) {
            // Simulate async delay (vulnerability window)
            setTimeout(function() {
                balance -= itemCost;
                updateBalance();
                
                const resultDiv = document.getElementById('purchase-result');
                if (resultDiv) {
                    resultDiv.innerHTML = '<div class="flag-message success">Purchase successful! Balance deducted.</div>';
                }
                
                // Check if balance went negative (exploited)
                if (balance < 0) {
                    revealFlag();
                }
            }, 100);
            
            return true;
        } else {
            const resultDiv = document.getElementById('purchase-result');
            if (resultDiv) {
                resultDiv.innerHTML = '<div class="flag-message error">Insufficient balance! You need ' + itemCost + ' tokens, but only have ' + balance + '.</div>';
            }
            return false;
        }
    };
    
    function updateBalance() {
        const balanceEl = document.getElementById('balance');
        if (balanceEl) {
            balanceEl.textContent = balance;
        }
    }
    
    function revealFlag() {
        if (flagRevealed) return;
        flagRevealed = true;
        
        const flagDiv = document.getElementById('flag-reveal');
        if (flagDiv) {
            flagDiv.classList.remove('hidden');
            flagDiv.innerHTML = '<div class="flag-message success"><strong>Race condition exploited!</strong><br>Flag: ' + flag + '</div>';
        }
    }
    
    window.checkFlag = function() {
        if (balance < 0) {
            revealFlag();
        } else {
            const flagDiv = document.getElementById('flag-reveal');
            if (flagDiv) {
                flagDiv.classList.remove('hidden');
                flagDiv.innerHTML = '<div class="flag-message error">Balance must be negative to reveal the flag. Exploit the race condition!</div>';
            }
        }
    };
    
    // Expose balance for inspection
    window.getBalance = function() {
        return balance;
    };
    
    // Exploit helper: rapid fire purchases
    window.exploitRaceCondition = function() {
        console.log('Attempting race condition exploit...');
        for (let i = 0; i < 5; i++) {
            makePurchase();
        }
    };
    
    document.addEventListener('DOMContentLoaded', function() {
        updateBalance();
        
        // Add exploit hint in console
        console.log('%cRace Condition Exploit Available', 'color: orange; font-weight: bold;');
        console.log('Try calling exploitRaceCondition() in the console, or rapidly click the purchase button.');
    });
})();

