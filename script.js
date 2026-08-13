const sBtn = document.getElementById("submitBtn");
const expenseAmount = document.getElementById("expense");
const balanceAmount = document.getElementById("balance");
const categoryFilter = document.getElementById("categoryFilter");
const expenseSearch = document.getElementById("expenseSearch");

const expenseList = document.getElementById("expenseList");
const expenseform = document.getElementById("expenseform");
const incomeAmount = document.getElementById("income");
const incomeform = document.getElementById("incomeform");

let incomes =JSON.parse(localStorage.getItem('incomes')) || [];

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;


(function addIncome(){

    incomeform.addEventListener("submit",(evt)=>{
        evt.preventDefault();

        const incomeTitle = document.getElementById('incomeTitle').value;
        const incomeAmount = document.getElementById('incomeAmount').value;
        const date = document.getElementById('incomeDate').value;

        const income ={
            title: incomeTitle,
            amount: Number(incomeAmount),
            date: date
        };

        if(incomeAmount === "" || incomeTitle === "" || date === ""){
            alert("Please fill all fields");
            return;
        }

        incomes.push(income);

        localStorage.setItem("incomes",JSON.stringify(incomes));
        // console.log(incomes);
        updateTotalIncome();
        updateBalance();

        incomeform.reset();
        
    });
})();



expenseform.addEventListener("submit", function(evt){
    evt.preventDefault();

    const tittle = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (tittle === "" || amount === "" || category === "" || date === ""){
        alert("Please fill all fields");
        return;
    }

    const expense = {
        tittle: tittle,
        amount: Number(amount),
        category: category,
        date: date
    };
   
    if(editIndex === null){
        expenses.push(expense);
    }else{
        expenses[editIndex] = expense;
        editIndex = null;
    }

    localStorage.setItem('expenses',JSON.stringify(expenses));
    
    
    // console.log(expense);

    renderExpenses();
    updateTotalExpense();
    updateBalance();

    expenseform.reset();
    sBtn.textContent = "Add Expense";
});



function renderExpenses(){
    
    expenseList.innerHTML = "";

    const selectCategory = categoryFilter.value;

    const searchText = expenseSearch.value.toLowerCase();

    const filterExpenses = expenses.filter(function(expense){
        const categoryMatch = selectCategory === "All" ||
            expense.category === selectCategory;

        const searchMatch = expense.tittle.toLowerCase().includes(searchText);

        return categoryMatch && searchMatch;
    });

    filterExpenses.forEach(function(expense){
        const index = expenses.indexOf(expense);
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("hisDetails");

        expenseItem.innerHTML = `
            <h3>${expense.tittle}</h3>
            <p>Amount: ₹${expense.amount}</p>
            <p>Category: ${expense.category}</p>
            <p>Date: ${expense.date}</p>
        
            <button onClick="editExpense(${index})">
               ✏️ Edit
            </button>
            
            <button onClick="deleteExpense(${index})">
                🗑️ Delete
            </button>
        `;

        expenseList.appendChild(expenseItem)
    });
}



categoryFilter.addEventListener("change", function(){
    renderExpenses();
})

expenseSearch.addEventListener('input',()=> {
    renderExpenses();
})

function updateTotalExpense(){
    const totalExpense = expenses.reduce(function(total,expense){
        return total+expense.amount;
    },0);
    expenseAmount.textContent = `₹${totalExpense}`;
}

function updateTotalIncome(){
    const totalIncome = incomes.reduce(function(total,income){
        return total + income.amount;
    },0);
    incomeAmount.textContent = `₹${totalIncome}`;
}

function updateBalance(){
    const totalIncome = incomes.reduce(function(total,income){
        return total + income.amount
    },0);

    const totalExpense = expenses.reduce(function(total,expense){
        return total+ expense.amount;
    },0);

    const balance = totalIncome - totalExpense;
    balanceAmount.textContent = `₹${balance}`;
}

function deleteExpense(index){
    expenses.splice(index,1);

    localStorage.setItem('expenses',JSON.stringify(expenses));

    renderExpenses();
    updateTotalExpense();
    updateBalance();
}

function editExpense(index){

    editIndex = index;
    const expense = expenses[index];

    document.getElementById("title").value = expense.tittle;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;

    sBtn.textContent= 'Update Expense';
}

renderExpenses();
updateTotalExpense();
updateTotalIncome();
updateBalance();