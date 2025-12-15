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
        const capturedBalance = balance; // Capture balance at start (race condition: multiple see same value)
        
        // Step 1: Add to pending immediately (before check completes)
        // This is the vulnerability - multiple can be added before checks complete
        pendingTransactions.push({
            txId: txId,
            amount: itemCost,
            timestamp: Date.now(),
            checked: false
        });
        
        // Step 2: Check balance (async with delay - creates vulnerability window)
        const checkPromise = new Promise((resolve) => {
            setTimeout(() => {
                // RACE CONDITION: Multiple checks can happen simultaneously before any deduction
                // All see the same balance value, so if sent rapidly, multiple can pass
                const balanceAtCheck = balance; // Use current balance (shared state)
                
                // Count OTHER pending transactions (excluding this one)
                const otherPending = pendingTransactions.filter(tx => tx.txId !== txId && !tx.checked);
                
                // Vulnerability: Allow transaction if balance is sufficient OR if other transactions are pending
                // This creates the race condition - if other transactions are already pending, this one can also pass
                if (balanceAtCheck >= itemCost || otherPending.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 30 + Math.random() * 40); // Random delay 30-70ms creates vulnerability window
        });
        
        // Step 3: After check completes, process transaction
        checkPromise.then((canPurchase) => {
            const txIndex = pendingTransactions.findIndex(tx => tx.txId === txId);
            if (txIndex === -1) return;
            
            if (canPurchase) {
                // Mark as valid and proceed with deduction
                pendingTransactions[txIndex].checked = true;
                
                // Step 4: Deduct balance (delayed - creates longer vulnerability window)
                setTimeout(() => {
                    balance -= itemCost;
                    updateBalance();
                    
                    // Remove from pending
                    const removeIndex = pendingTransactions.findIndex(tx => tx.txId === txId);
                    if (removeIndex !== -1) {
                        pendingTransactions.splice(removeIndex, 1);
                    }
                    
                    // Check for successful exploitation after deduction
                    // Flag revealed if balance went negative OR multiple checked transactions exist
                    const checkedCount = pendingTransactions.filter(tx => tx.checked === true).length;
                    if (balance < 0 || checkedCount > 1) {
                        revealFlag();
                    }
                }, 80 + Math.random() * 80); // Delayed deduction 80-160ms
                
                const resultDiv = document.getElementById('purchase-result');
                if (resultDiv) {
                    resultDiv.innerHTML = '<div class="flag-message success">Purchase queued (TX: ' + txId + '). Balance will be deducted shortly.</div>';
                }
            } else {
                // Remove failed transaction
                const removeIndex = pendingTransactions.findIndex(tx => tx.txId === txId);
                if (removeIndex !== -1) {
                    pendingTransactions.splice(removeIndex, 1);
                }
                
                const resultDiv = document.getElementById('purchase-result');
                if (resultDiv) {
                    resultDiv.innerHTML = '<div class="flag-message error">Insufficient balance! You need ' + itemCost + ' tokens, but only have ' + capturedBalance + '.</div>';
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
        const checkedCount = pendingTransactions.filter(tx => tx.checked).length;
        if (balance < 0 || checkedCount > 1 || (checkedCount > 0 && balance < itemCost && pendingTransactions.length > 0)) {
            revealFlag();
        } else {
            const flagDiv = document.getElementById('flag-reveal');
            if (flagDiv) {
                flagDiv.classList.remove('hidden');
                const status = 'Balance: ' + balance + ', Pending TX: ' + pendingTransactions.length + ', Checked: ' + checkedCount;
                flagDiv.innerHTML = '<div class="flag-message error">Race condition not exploited yet. ' + status + '<br>Try triggering multiple rapid purchases.</div>';
            }
        }
    };
    
    // Exploit helper: rapid fire purchases
    window.exploitRaceCondition = function() {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                makePurchase();
            }, i * 10); // Stagger slightly but still within vulnerability window
        }
    };
    
    // Advanced exploit: understand the async timing
    window.advancedExploit = function() {
        // Trigger many purchases simultaneously (no delay to maximize race condition)
        for (let i = 0; i < 20; i++) {
            makePurchase(); // No setTimeout - all trigger immediately
        }
    };
    
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        updateBalance();
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
