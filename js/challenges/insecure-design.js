// Insecure Design Challenge - Expert level with complex race condition
(function() {
    // Flag obfuscated by splitting and reconstructing
    const flagParts = ['CTF{', 'R4c3_', 'C0nd1', '7i0n_', 'Expl0', '1t3d}'];
    const flag = flagParts.join('');
    
    // Complex race condition scenario
    let balance = 100;
    const itemCost = 150;
    let flagRevealed = false;
    let transactionCount = 0;
    let pendingTransactions = [];
    
    // Multi-step race condition - flag only revealed after complex exploitation
    window.makePurchase = function() {
        transactionCount++;
        const txId = 'tx_' + transactionCount + '_' + Date.now();
        
        // Step 1: Check balance (async with delay - vulnerability window)
        const checkPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve(balance >= itemCost);
            }, 50 + Math.random() * 50); // Random delay increases race condition probability
        });
        
        // Step 2: If check passes, add to pending (vulnerability: check happens before deduction)
        checkPromise.then((canPurchase) => {
            if (canPurchase) {
                pendingTransactions.push({
                    txId: txId,
                    amount: itemCost,
                    timestamp: Date.now()
                });
                
                // Step 3: Actually deduct balance (delayed)
                setTimeout(() => {
                    balance -= itemCost;
                    updateBalance();
                    
                    // Check if exploitation succeeded (balance went negative or multiple transactions)
                    if (balance < 0 || pendingTransactions.length > 1) {
                        revealFlag();
                    }
                }, 100 + Math.random() * 100);
                
                const resultDiv = document.getElementById('purchase-result');
                if (resultDiv) {
                    resultDiv.innerHTML = '<div class="flag-message success">Purchase queued (TX: ' + txId + '). Balance will be deducted shortly.</div>';
                }
            } else {
                const resultDiv = document.getElementById('purchase-result');
                if (resultDiv) {
                    resultDiv.innerHTML = '<div class="flag-message error">Insufficient balance! You need ' + itemCost + ' tokens, but only have ' + balance + '.</div>';
                }
            }
        });
        
        return txId;
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
            flagDiv.innerHTML = '<div class="flag-message success"><strong>Race condition exploited successfully!</strong><br>Multiple transactions processed before balance deduction.<br>Flag: ' + flag + '</div>';
        }
    }
    
    window.checkFlag = function() {
        if (balance < 0 || pendingTransactions.length > 1) {
            revealFlag();
        } else {
            const flagDiv = document.getElementById('flag-reveal');
            if (flagDiv) {
                flagDiv.classList.remove('hidden');
                const status = 'Balance: ' + balance + ', Pending TX: ' + pendingTransactions.length;
                flagDiv.innerHTML = '<div class="flag-message error">Race condition not exploited yet. ' + status + '<br>Try triggering multiple rapid purchases to exploit the timing window.</div>';
            }
        }
    };
    
    // Exploit helper: rapid fire purchases
    window.exploitRaceCondition = function() {
        console.log('Attempting race condition exploit...');
        console.log('Triggering 100 rapid purchase requests...');
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                makePurchase();
            }, i * 10); // Stagger slightly but still within vulnerability window
        }
    };
    
    // Advanced exploit: understand the async timing
    window.advancedExploit = function() {
        console.log('%cAdvanced Exploit: Understanding Async Race Conditions', 'color: orange; font-weight: bold;');
        console.log('The vulnerability: balance check and deduction are separate async operations');
        console.log('If multiple checks complete before any deduction, all will pass');
        console.log('Solution: Trigger multiple purchases rapidly to exploit the timing window');
        
        // Trigger many purchases
        for (let i = 0; i < 15; i++) {
            makePurchase();
        }
    };
    
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        updateBalance();
        
        console.log('%cRace Condition Exploit Available', 'color: orange; font-weight: bold;');
        console.log('Try calling exploitRaceCondition() or advancedExploit() in the console');
        console.log('Or rapidly click the purchase button multiple times');
        console.log('The flag will only be revealed if you successfully exploit the race condition');
    }
    
    // Single initialization path
    function attemptInit() {
        const balanceEl = document.getElementById('balance');
        if (balanceEl || document.readyState === 'complete') {
            setTimeout(initChallenge, 50);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChallenge, { once: true });
        } else {
            setTimeout(initChallenge, 100);
        }
    }
    
    window.initInsecureDesign = initChallenge;
    attemptInit();
})();
