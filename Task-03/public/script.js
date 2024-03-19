document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expenseForm');
    const tableBody = document.getElementById('transactionBody');
    const totalAmount = document.getElementById('totalAmount');
    let transactions = [];

    // Fetch existing transactions on page load
    fetch('/transactions')
        .then(response => response.json())
        .then(data => {
            transactions = data;
            renderTransactions();
            updateTotal();
        })
        .catch(error => console.error('Error:', error));

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const description = formData.get('description');
        const amount = parseFloat(formData.get('amount'));
        const type = formData.get('type');

        const transaction = {
            description,
            amount,
            type
        };

        // Send POST request to add transaction
        fetch('/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
        .then(response => response.json())
        .then(data => {
            transactions.push(data);
            renderTransactions();
            updateTotal();
            form.reset();
        })
        .catch(error => console.error('Error:', error));
    });

    function renderTransactions() {
        tableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td class="${transaction.type === 'expense' ? 'expense' : 'income'}">₹${transaction.amount.toFixed(2)}</td>
                <td>${transaction.type}</td>
                <td><button onclick="deleteTransaction('${transaction._id}')">Cancel</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateTotal() {
        const total = transactions.reduce((acc, curr) => {
            if (curr.type === 'expense') {
                return acc - curr.amount;
            } else {
                return acc + curr.amount;
            }
        }, 0);
        totalAmount.textContent = `₹${total.toFixed(2)}`;
    }
    function deleteTransaction(id) {
        fetch(`/transactions/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                transactions = transactions.filter(transaction => transaction._id !== id);
                renderTransactions();
                updateTotal();
            } else {
                console.error('Failed to delete transaction:', response.statusText);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
});
