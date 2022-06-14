import {useEffect, useState} from "react";
import {v4 as myNewID} from "uuid";

import "./App.css";

// button-group
const buttons = [
    {
        type: "all",
        label: "All",
    },
    {
        type: "active",
        label: "Active",
    },
    {
        type: "done",
        label: "Done",
    },
];

function App() {
    const [itemToDo, setItemToDo] = useState("");

    const [searchToDo, setSearchToDo] = useState("")

    const [items, setItems] = useState([]);

    const [filterType, setFilterType] = useState("all");

    const handleDeleteItem = ({key}) => {
        let index = items.map((e)=>{ return e.key; }).indexOf(key);
        let rightSide = items.slice(0, index)
        let leftSide = items.slice(index+1, items.length)
        let newArray = rightSide.concat(leftSide)
        localStorage.removeItem(key)
        setItems(newArray)
    }

    const handleItemImportant = ({key}) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.key === key) {
                    return {...item, important: !item.important};
                } else return item;
            })
        );
    };

    const handleToDoChange = (event) => {
        setItemToDo(event.target.value);
    };

    const handleAddItem = () => {
        const newItem = {key: myNewID(), label: itemToDo};

        if(itemToDo){
            setItems((prevElement) => [...prevElement, newItem]);
        }

        setItemToDo("");
    };

    const handleItemDone = ({key}) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.key === key) {
                    return {...item, done: !item.done};
                } else return item;
            })
        );
    };

    const handleFilterChange = ({type}) => {
        setSearchToDo("")
        setFilterType(type);

    };

    const moreToDo = items.filter((item) => !item.done).length;

    const doneToDo = items.length - moreToDo;

    const filteredArray =
        filterType === "all"
            ? items
            : filterType === "done"
                ? items.filter((item) => item.done)
                : items.filter((item) => !item.done);

    const handleToDoSearch = (event) => {
        setSearchToDo(event.target.value);
    };

    const searchArray = items.filter(item =>
        item.label.substring(0, searchToDo.length).toLowerCase() === searchToDo.toLowerCase())

    const arraySF = !searchToDo ? filteredArray : searchArray

    items.map((item)=>localStorage.setItem(item.key, item.label))

    useEffect(()=>{
        items.map((item)=>localStorage.setItem(item.key, item.label))
        let newNewArray = [];
        for(let key in localStorage) {
            if (!localStorage.hasOwnProperty(key)) {
                continue;
            }
            let newNewItem = {
                key: key,
                label: localStorage.getItem(key)
            }
            newNewArray.push(newNewItem)
        }
        setItems(newNewArray)
    }, [])

    return (
        <div className="todo-app">
            {/* App-header */}
            <div className="app-header d-flex">
                <h1>Todo List</h1>
                <h2>
                    {moreToDo} more to do, {doneToDo} done
                </h2>
            </div>

            <div className="top-panel d-flex">
                {/* Search-panel */}
                <input
                    value={searchToDo}
                    type="text"
                    className="form-control search-input"
                    onChange={handleToDoSearch}
                    placeholder="type to search"
                />
                {/* Item-status-filter */}
                <div className="btn-group">
                    {buttons.map((item) => (
                        <button
                            key={item.type}
                            type="button"
                            className={`btn btn-info ${
                                filterType === item.type ? "" : "btn-outline-info"
                            }`}
                            onClick={() => handleFilterChange(item)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List-group */}
            <ul className="list-group todo-list">
                {arraySF.length > 0 &&
                    arraySF.map((item) => (
                        <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? "done" : ""} ${item.important ? "important" : ""}`}>
                <span
                    className="todo-list-item-label"
                    onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                    type="button"
                    onClick={() => handleItemImportant(item)}
                    className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation"/>
                </button>

                <button
                    type="button"
                    onClick={() => handleDeleteItem(item)}
                    className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o"/>
                </button>
              </span>
                        </li>
                    ))}
            </ul>

            <div className="item-add-form d-flex">
                <input
                    value={itemToDo}
                    type="text"
                    className="form-control"
                    placeholder="What needs to be done"
                    onChange={handleToDoChange}
                />
                <button className="btn btn-outline-secondary" onClick={handleAddItem}>
                    Add item
                </button>
            </div>
        </div>
    );
}

export default App;