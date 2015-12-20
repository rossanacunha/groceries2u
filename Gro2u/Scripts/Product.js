//URL
var productUrl = '/api/products';

// Model
function Product(data) {
    var self = this;
    data = data || {};

    self.Id = data.Id;
    self.InternalName = data.Name;
    self.Name = ko.observable(data.Name || "");
    self.error = ko.observable();

    self.acceptChanges = function () {
        dataContext.saveProduct(self);
        window.productViewModel.selectedProduct(null);
    };
    self.cancelChanges = function () {
        window.productViewModel.selectedProduct(null);
    };
    self.deleteProduct = function () {
        if (confirm('Do you really want to delete this product?')) {
            dataContext.deleteProduct(self).done(function () {
                window.productViewModel.products.remove(self);
            });
        }
    }
}

// DataContext 
var dataContext = {
    saveProduct: function (product) {
        var InsertMode = product.Id ? false : true;
        product.error(null);
        if (InsertMode) {
            var options = {
                dataType: "json",
                contentType: "application/json",
                cache: false,
                type: 'POST',
                data: ko.toJSON(product)
            };
            return $.ajax(productUrl, options)
                 .done(function (result) {
                     product.Id = result.Id;
                     window.productViewModel.products.push(product);
                 })
                 .fail(function () {
                     alert('Error on adding product.');
                 });
        }
        else {
            var options = {
                dataType: "json",
                contentType: "application/json",
                cache: false,
                type: 'PUT',
                data: ko.toJSON(product)
            };
            return $.ajax(productUrl + "/" + product.Id, options)
                 .fail(function () {
                     product.error('Error on adding product');
                 });
        }
    },
    getProducts: function (productObservable, errorObservable) {
        var options = {
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'GET'
        };
        return $.ajax(productUrl, options)
             .done(getSucceeded)
             .fail(getFailed);
        function getSucceeded(data) {
            var mappedProducts = $.map(data, function (list) { return new Product(list); });
            productObservable(mappedProducts);
        }
        function getFailed() {
            errorObservable("Error retrieving products.");
        }
    },
    deleteProduct: function (product) {
        var options = {
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'DELETE'
        };
        return $.ajax(productUrl + "/" + product.Id, options)
             .fail(function () {
                 product.error('Error on deleting product.');
             });
    }
}

//Initialize a jQuery UI dialog
ko.bindingHandlers.jqDialog = {
    init: function (element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).dialog("destroy");
        });
        $(element).dialog(options);
    }
};

//Opens/closes the dialog
ko.bindingHandlers.openDialog = {
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value) {
            $(element).dialog("open");
        } else {
            $(element).dialog("close");
        }
    }
}

//ViewModel
window.productViewModel = (function () {
    var products = ko.observableArray(),
    error = ko.observable(),
    addProduct = function () {
        selectedProduct(new Product());
    },
    selectedProduct = ko.observable(''),
    editProduct = function (product) {
        selectedProduct(product);
    }
    sortProducts = function () {
        window.productViewModel.products.sort(function (l, r) {
            return (l.Name().toLowerCase() == r.Name().toLowerCase()) ? (l.Name().toLowerCase() > r.Name().toLowerCase() ? 1 : -1) : (l.Name().toLowerCase() > r.Name().toLowerCase() ? 1 : -1)
            //return left.InternalName == right.InternalName ? 0 : (left.InternalName < right.InternalName ? -1 : 1)
        });
    }

    dataContext.getProducts(products, error);
    return {
        products: products,
        error: error,
        addProduct: addProduct,
        selectedProduct: selectedProduct,
        editProduct: editProduct,
        sortProducts: sortProducts
    }
})();

// Initiate the Knockout bindings
ko.applyBindings(window.productViewModel);