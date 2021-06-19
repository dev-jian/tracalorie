// Storage Controller
const StorageCtrl = (function() {
  return {
    storeItem: function(newItem) {
      const items = this.getItems();
      items.push(newItem);
      localStorage.setItem("items", JSON.stringify(items));
    },
    getItems: function() {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItem: function(updatedItem) {
      let items = this.getItems();
      items = items.map((item) => {
        if (item.id === updatedItem.id) {
          item.name = updatedItem.name;
          item.calories = updatedItem.calories;
        }

        return item;
      });

      localStorage.setItem("items", JSON.stringify(items));

      return items;
    },
    deleteItem: function(itemToDelete) {
      let items = this.getItems();
      
      items = items.filter((item) => {
        return item.id !== itemToDelete.id;
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItems: function() {
      localStorage.removeItem("items");
    }
  }
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  } 

  // Data Structure / state
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    },
    addItem: function(name, calories) {
      let ID;

      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      const newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function() {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      })

      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    updateItem: function(name, calories) {
      this.getCurrentItem().name = name;
      this.getCurrentItem().calories = parseInt(calories);

      this.getTotalCalories();

      return this.getCurrentItem();
    },
    deleteCurrentItem: function() {
      data.items = data.items.filter(item => {
        return item.id !== data.currentItem.id;
      });

      this.setCurrentItem(null);

      this.getTotalCalories();
    },
    clearAllItems: function() {
      data.items = [];
      data.currentItem = null;
      data.totalCalories = 0;
    },
    setItems: function(storedItems) {
      data.items = storedItems;

      return data.items;
    }
  }
})();


// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    clearAllBtn: ".clear-all"
  }

  // Public Methods
  return {
    populateItemList: function(items) {
      let listHtml = "";

      items.forEach((item) => {
        listHtml += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="material-icons edit-item">create</i></a>
          </li>
        `;
      });

      document.querySelector(UISelectors.itemList).innerHTML = listHtml;
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      const name = document.querySelector(UISelectors.itemNameInput).value;

      const calories = document.querySelector(UISelectors.itemCaloriesInput).value;

      return {
        name: name,
        calories: calories
      };
    },
    addListItem: function(item) {
      // Create li element
      const li = document.createElement("li");
      li.classList.add("collection-item");
      li.id = `item-${item.id}`;

      let html = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="material-icons edit-item">create</i></a>
      `;

      li.innerHTML = html;

      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);

      document.querySelector(UISelectors.itemList).style.display = "block";
    },
    addToForm: function(item) {
      document.querySelector(UISelectors.itemNameInput).value = item.name;
      document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
    },
    clearFields: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      this.clearFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function(item) {
      this.addToForm(item);
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    updateItem: function(updatedItem) {
      document.querySelector(`#item-${updatedItem.id}`).innerHTML = `
      <strong>${updatedItem.name}: </strong><em>${updatedItem.calories} Calories</em><a href="#" class="secondary-content"><i class="material-icons edit-item">create</i></a>
      `;
    },
    deleteItem: function(itemToDelete) {
      document.querySelector(`#item-${itemToDelete.id}`).remove();

      this.clearEditState();
    },
    clearAllItems: function() {
      document.querySelector(UISelectors.itemList).innerHTML = "";

      this.hideList();

      this.showTotalCalories(0);
    }
  }
})();


// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  // Load Evenet Listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    // Add Item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener("click", itemUpdateClick);

    // Update Btn click event
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    // Update delete submit event
    document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

    // back btn click event
    document.querySelector(UISelectors.backBtn).addEventListener("click", itemBackClick);

    // clear all btn click event
    document.querySelector(UISelectors.clearAllBtn).addEventListener("click", clearAllItemsClick);
  }

  // item submit event
  const itemAddSubmit = function(e) {
    e.preventDefault();
    
    // Get form input from ui controller
    const input = UICtrl.getItemInput();
    
    if (input.name !== "" && input.calories !== "") {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add Item to UI List
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      
      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearFields();
    }
  }

  // item edit click event
  const itemUpdateClick = function(e) {
    e.preventDefault();

    if (e.target.classList.contains("edit-item")) {

      const listId = e.target.parentElement.parentElement.id;

      const id = parseInt(listId.split("-")[1]);
      
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.showEditState(itemToEdit);
    }
  }

  // item update submit event
  const itemUpdateSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    StorageCtrl.updateItem(updatedItem);

    UICtrl.updateItem(updatedItem);

    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

    ItemCtrl.setCurrentItem(null);

    UICtrl.clearEditState();
  }

  // item delete submit event
  const itemDeleteSubmit = function(e) {
    e.preventDefault();

    const itemToDelete = ItemCtrl.getCurrentItem();

    StorageCtrl.deleteItem(itemToDelete);

    ItemCtrl.deleteCurrentItem();

    UICtrl.deleteItem(itemToDelete);
    
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
  }

  // item back click evenet
  const itemBackClick = function(e) {
    e.preventDefault();

    ItemCtrl.setCurrentItem(null);

    UICtrl.clearEditState();
  }

  // clear all click event
  const clearAllItemsClick = function(e) {
    e.preventDefault();
    
    StorageCtrl.clearAllItems();
    
    ItemCtrl.clearAllItems();
    
    UICtrl.clearAllItems();

  }

  // Public Methods
  return {
    init: function() {
      // clear edit state / set initial set
      UICtrl.clearEditState();

      // Fetch items from item controller
      const items = ItemCtrl.setItems(StorageCtrl.getItems());

      // hide list when item is 0
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();