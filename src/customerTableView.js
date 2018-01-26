/**
* Append a customer id and name to the customeInvitedr table on the HTML page
* @param customer - the customer object to append to the table
* */
function appendToCustomersTable(customer) {
  const customerTableRow = document.createElement('tr');

  customerTableRow.innerHTML = `<td>${customer.user_id}</td>
                                <td>${customer.name}</td>`;

  document.getElementById('tableCustomersBody').appendChild(customerTableRow);
}

/**
* Display a simple error message if there is a problem
* @param message - the error message to be printed on the page
* */
function printErrorMessage(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.innerHTML = message;
  errorMessage.style.display = 'block';
}

export { appendToCustomersTable, printErrorMessage };
