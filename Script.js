 
let currentEnvelopeIndex = null;
let deleteEnvIndex = null;
let deleteExpIndex = null;

let envelopes = JSON.parse(localStorage.getItem("envelopes")) || [];
renderEnvelopes();




document.getElementById("addEnvelopeBtn").addEventListener("click", showEnvelopeForm);

function showEnvelopeForm(){
    const div = document.getElementById("envelopeForm");
    div.innerHTML = `


      
<div style="background-color:#8B9BE7; padding:20px; border-radius:30px">

  <div class="input-group input-group-sm mb-3" style="width:50%">
    <span class="input-group-text">Envelope Name</span>
    <input type="text" id="envName" class="form-control">
  </div>

  <div class="input-group input-group-sm mb-3" style="width:50%">
    <span class="input-group-text">Total Budget</span>
    <input type="number" id="envBudget" class="form-control">
  </div>

  <button onclick="createEnvelope()" class="btn btn-secondary">Create</button>

</div>

    `;
}

function createEnvelope(){
    let name = document.getElementById("envName").value;
    let budget = Number(document.getElementById("envBudget").value);

    envelopes.push({
        name: name,
        budget: budget,
        spent: 0,
        expenses: []
    });

    document.getElementById("envelopeForm").innerHTML = "";
    saveData();

    renderEnvelopes();
}

function renderEnvelopes(){
    const container = document.getElementById("envelopesContainer");
    container.innerHTML = "";

    envelopes.forEach((env, index) => {

        // color logic
        let statusColor = "green";
        let statusText = `Remaining: ₹${env.budget - env.spent}`;

        if(env.spent > env.budget){
            statusColor = "red";
            statusText = `Overspent by ₹${env.spent - env.budget}`;
        }

let expenseList = env.expenses
    .map((e, expIndex) => `
        <li class="d-flex justify-content-between align-items-center my-1">

            <span>₹${e.amount} - ${e.desc}</span>

            <span>
                <button class="btn btn-sm btn-warning me-2"
                    onclick="editExpense(${index}, ${expIndex})">
                    Edit
                </button>

                <button class="btn btn-sm btn-danger"
                    onclick="openDeleteModal(${index}, ${expIndex})">
                    Delete
                </button>
            </span>

        </li>
    `).join("");

 container.innerHTML += `
<div class="col-md-4 col-sm-6 col-lg-3">
<div class="card shadow-sm mb-3">

    <div class="card-body">

      <div class="d-flex justify-content-between align-items-center">
  <h5 class="card-title mb-0">${env.name}</h5>

  <button class="btn btn-sm btn-outline-danger"
      onclick="deleteEnvelope(${index})">
      ❌
  </button>
</div>

        <p class="card-text mb-1"><strong>Total:</strong> ₹${env.budget}</p>
        <p class="card-text mb-1"><strong>Spent:</strong> ₹${env.spent}</p>
        <p class="card-text" style="color:${statusColor}">
            ${statusText}
        </p>

        <button class="btn btn-primary btn-sm"
            onclick="showExpenseForm(${index})">
            Add Expense
        </button>

        <hr>

        <ul class="list-group">
            ${expenseList}
        </ul>

    </div>
</div>
</div>
`;

    });
}

function showExpenseForm(index){
    currentEnvelopeIndex = index;

    const modal = new bootstrap.Modal(
        document.getElementById("expenseModal")
    );

    modal.show();
}

function addExpense(index){
    const amount = Number(document.getElementById("expAmount").value);
    const desc = document.getElementById("expDesc").value;

    envelopes[index].expenses.push({ amount, desc });

    envelopes[index].spent += amount;

    document.getElementById("envelopeForm").innerHTML = "";
    saveData();

    renderEnvelopes();
}


  // delete Expense 

   
function deleteExpense(envIndex, expIndex) {
    const exp = envelopes[envIndex].expenses[expIndex];

    // reduce spent total also
    envelopes[envIndex].spent -= exp.amount;

    envelopes[envIndex].expenses.splice(expIndex, 1);
    saveData();

   renderEnvelopes();
}

// Edit Expense 

function editExpense(envIndex, expIndex) {

    let exp = envelopes[envIndex].expenses[expIndex];

    const newAmount = Number(prompt("Enter new amount:", exp.amount));
    const newDesc = prompt("Enter new description:", exp.desc);

    // adjust spent total
    envelopes[envIndex].spent -= exp.amount;
    envelopes[envIndex].spent += newAmount;

    exp.amount = newAmount;
    exp.desc = newDesc;
    saveData();

     renderEnvelopes();
}



function saveExpense(){

    const amount = Number(document.getElementById("expAmount").value);
    const desc = document.getElementById("expDesc").value;

    envelopes[currentEnvelopeIndex].expenses.push({
        amount: amount,
        desc: desc
    });

    envelopes[currentEnvelopeIndex].spent += amount;

    document.getElementById("expAmount").value = "";
    document.getElementById("expDesc").value = "";
    saveData();

    renderEnvelopes();

    // close modal
    const modalEl = document.getElementById("expenseModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

function openDeleteModal(envIndex, expIndex){
    deleteEnvIndex = envIndex;
    deleteExpIndex = expIndex;

    const modal = new bootstrap.Modal(
        document.getElementById("deleteModal")
    );

    modal.show();
}

function confirmDelete(){

    const exp = envelopes[deleteEnvIndex].expenses[deleteExpIndex];

    // reduce spent correctly
    envelopes[deleteEnvIndex].spent -= exp.amount;

    // remove from array
    envelopes[deleteEnvIndex].expenses.splice(deleteExpIndex, 1);
    saveData();

    renderEnvelopes();

    // close modal
    const modalEl = document.getElementById("deleteModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

function saveData(){
    localStorage.setItem("envelopes", JSON.stringify(envelopes));
}

function deleteEnvelope(index) {

    const confirmDelete = confirm(
        `Delete envelope "${envelopes[index].name}"?\nAll expenses will be lost.`
    );

    if (!confirmDelete) return;

    envelopes.splice(index, 1);
    saveData();
    renderEnvelopes();
}
