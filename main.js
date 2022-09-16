const api = "https://5cdb88ec069eb30014202239.mockapi.io/product";
var loading = document.getElementById("loading");

getAllProduct();


var form = document.getElementById("add-product");
form.onsubmit = function (event) {
    event.preventDefault();
    var data = {};
    const onlyInputs = form.querySelectorAll('input');
    onlyInputs.forEach(input => {
        data[input.name] = input.value;
    });
    addProduct(data, form);
}

function getAllProduct(search = false, seachData) {
    fetch(api).then(response => {
        loading.style.display = "block";
        return response.json();
    }).then(data => {
        if (data.length > 0) {
            if (search) {
                if (seachData.name) {
                    data = data.filter(product => {
                        return product.name == seachData.name;
                    })
                }
                if (seachData.provider) {
                    data = data.filter(product => {
                        return product.provider == seachData.provider;
                    })
                }
                if (seachData.price) {
                    data = data.filter(product => {
                        return product.price == seachData.price;
                    })
                }
            }
            var htmls = [];
            data.forEach((product, index) => {
                var html = `<tr>
                <th>${++index}</th>
                <td>${product.name}</td> 
                <td>${product.provider}</td>
                <td>${product.price}</td>
                <td>
                    <i onclick=showModelUpdate(${product.id}) class="bi bi-pencil-square"></i>
                    <i onclick=showModelDelete(${product.id}) class="bi bi-trash delete"></i>
                </td>
              </tr>`;
                htmls.push(html);
            });
            document.querySelector('.data-body').innerHTML = htmls.join('');
        }
        if (data.length == 0) {
            document.querySelector('.data-body').innerHTML = `<tr>
                <td class="text-center" colspan="5">Khong co du lieu</td>
              </tr>`;
        }
        loading.style.display = "none";
    })
}

function addProduct(data, form) {
    loading.style.display = "block";
    fetch(api, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            getAllProduct();
            resetForm(form);
            loading.style.display = "none";
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function resetForm(form) {
    const onlyInputs = form.querySelectorAll('input');
    onlyInputs.forEach(input => {
        input.value = '';
    });
}

function showModelUpdate(id) {
    getProductById(id);
}

function closeModal(params) {
    var dialog = params.closest(".modal");
    dialog.classList.remove("showDialog");
}

function getProductById(id) {
    fetch(`${api}/${id}`)
        .then(data => {
            return data.json();
        })
        .then(product => {
            var dialog = document.getElementById("dialog-update");
            var form = document.getElementById("update-product");
            dialog.classList.add("showDialog");
            const onlyInputs = form.querySelectorAll('input');
            onlyInputs.forEach(input => {
                input.value = product[input.name];
            });
        });
}

var formUpdate = document.getElementById("update-product");
formUpdate.onsubmit = function (event) {
    event.preventDefault();
    var data = {};
    const onlyInputs = formUpdate.querySelectorAll('input');
    onlyInputs.forEach(input => {
        data[input.name] = input.value;
    });
    updateProduct(data, formUpdate);
}


function updateProduct(data, form) {
    loading.style.display = "block";
    fetch(`${api}/${data.id}`, {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            getAllProduct();
            closeModal(form);
            loading.style.display = "none";
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function showModelDelete(id) {
    var dialog = document.getElementById("dialog-delete");
    dialog.querySelector("input").value = id;
    dialog.classList.add("showDialog");
}

function deleteData(param) {
    loading.style.display = "block";
    var id = param.closest(".modal").querySelector("input").value;
    fetch(`${api}/${id}`, {
        method: 'DELETE'
    })
        .then((response) => response.json())
        .then((data) => {
            getAllProduct();
            closeModal(param);
            loading.style.display = "none";
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function onSearch(param) {
    var data = {};
    var form = param.closest("#add-product");
    const onlyInputs = form.querySelectorAll('input');
    onlyInputs.forEach(input => {
        data[input.name] = input.value;
    });
    getAllProduct(true, data);
}
