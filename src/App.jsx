import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import './App.css';

const { FiPlus, FiTrash2, FiCheck, FiAlertCircle, FiArrowUp, FiMinus, FiFilter } = FiIcons;

const PRIORITY_LEVELS = {
  high: { label: 'High', color: 'red', icon: FiAlertCircle, value: 3 },
  medium: { label: 'Medium', color: 'orange', icon: FiArrowUp, value: 2 },
  low: { label: 'Low', color: 'blue', icon: FiMinus, value: 1 }
};

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('priority'); // 'priority', 'created', 'alphabetical'

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        priority: selectedPriority,
        createdAt: new Date()
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodoPriority = (id, newPriority) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority: newPriority } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getFilteredAndSortedTodos = () => {
    let filtered = todos;
    
    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filterPriority);
    }

    // Sort todos
    return filtered.sort((a, b) => {
      // Always show completed tasks at the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sortBy) {
        case 'priority':
          return PRIORITY_LEVELS[b.priority].value - PRIORITY_LEVELS[a.priority].value;
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });
  };

  const getPriorityStats = () => {
    const incompleteTodos = todos.filter(todo => !todo.completed);
    return {
      high: incompleteTodos.filter(todo => todo.priority === 'high').length,
      medium: incompleteTodos.filter(todo => todo.priority === 'medium').length,
      low: incompleteTodos.filter(todo => todo.priority === 'low').length,
      total: incompleteTodos.length
    };
  };

  const filteredTodos = getFilteredAndSortedTodos();
  const stats = getPriorityStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Priority Task Manager
        </h1>

        {/* Priority Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
            <div key={key} className={`p-3 rounded-lg border-2 border-${priority.color}-200 bg-${priority.color}-50`}>
              <div className="flex items-center justify-center gap-2">
                <SafeIcon icon={priority.icon} className={`w-4 h-4 text-${priority.color}-600`} />
                <span className={`text-sm font-medium text-${priority.color}-700`}>
                  {priority.label}
                </span>
              </div>
              <div className={`text-2xl font-bold text-${priority.color}-600 text-center mt-1`}>
                {stats[key]}
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Form */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center font-medium"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
              Add
            </button>
          </div>

          {/* Priority Selection */}
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-600 py-2">Priority:</span>
            {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
              <button
                key={key}
                onClick={() => setSelectedPriority(key)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPriority === key
                    ? `bg-${priority.color}-500 text-white shadow-md`
                    : `bg-${priority.color}-100 text-${priority.color}-700 hover:bg-${priority.color}-200`
                }`}
              >
                <SafeIcon icon={priority.icon} className="w-4 h-4" />
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Filter:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">Priority</option>
              <option value="created">Date Created</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <SafeIcon icon={FiCheck} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">
                {filterPriority !== 'all' 
                  ? `No ${filterPriority} priority tasks` 
                  : 'Add a task above to get started!'
                }
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => {
              const priority = PRIORITY_LEVELS[todo.priority];
              return (
                <div
                  key={todo.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    todo.completed
                      ? 'bg-green-50 border-green-200 opacity-75'
                      : `bg-white border-${priority.color}-200 hover:border-${priority.color}-300 shadow-sm hover:shadow-md`
                  }`}
                >
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {todo.completed && <SafeIcon icon={FiCheck} className="w-4 h-4" />}
                  </button>

                  {/* Priority Indicator */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md bg-${priority.color}-100`}>
                    <SafeIcon icon={priority.icon} className={`w-3 h-3 text-${priority.color}-600`} />
                    <span className={`text-xs font-medium text-${priority.color}-700`}>
                      {priority.label}
                    </span>
                  </div>

                  {/* Task Text */}
                  <span
                    className={`flex-1 transition-all duration-200 ${
                      todo.completed
                        ? 'text-green-700 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>

                  {/* Priority Change Buttons */}
                  {!todo.completed && (
                    <div className="flex gap-1">
                      {Object.entries(PRIORITY_LEVELS).map(([key, priorityOption]) => (
                        <button
                          key={key}
                          onClick={() => updateTodoPriority(todo.id, key)}
                          className={`p-1 rounded transition-colors duration-200 ${
                            todo.priority === key
                              ? `bg-${priorityOption.color}-500 text-white`
                              : `text-${priorityOption.color}-500 hover:bg-${priorityOption.color}-100`
                          }`}
                          title={`Set ${priorityOption.label} Priority`}
                        >
                          <SafeIcon icon={priorityOption.icon} className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {todos.length > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800 mb-2">
                {stats.total} active tasks
              </div>
              <div className="text-sm text-blue-600">
                {stats.high > 0 && `${stats.high} high priority • `}
                {stats.medium > 0 && `${stats.medium} medium priority • `}
                {stats.low > 0 && `${stats.low} low priority • `}
                {todos.filter(todo => todo.completed).length} completed
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;