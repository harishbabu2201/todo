import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FiTrash } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { FaEye } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pages from './Pages';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [isView,setIsView]=useState(false)
  const [single,setSingle]=useState({})

  const [formData, setFormData] = useState({ task: '', date: '', id: '', taskDetails: '', isComplete: false });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("todos")) || [];
    setTasks(storedTasks);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, isComplete: !task.isComplete } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("todos", JSON.stringify(updatedTasks));
  };

  const handleClick = () => {
    if (formData.task && formData.date) {
      const updatedTasks = isEditing 
        ? tasks.map(task =>
            task.id === formData.id
              ? { ...task, task: formData.task, date: formData.date, taskDetails: formData.taskDetails, isComplete: formData.isComplete }
              : task
          )
        : [...tasks, { ...formData, id: uuidv4() }];

      setTasks(updatedTasks);
      localStorage.setItem("todos", JSON.stringify(updatedTasks));
      toast.success(isEditing ? 'Task updated successfully!' : 'Task added successfully!');
      
      setFormData({ task: '', date: '', id: '', taskDetails: '', isComplete: false });
      setShowModal(false);
      setIsEditing(false);
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleEdit = (task) => {
    setFormData(task);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (id) => {
    const selectedTask = tasks.find((task) => task.id === id);
    setSingle(selectedTask);
    setIsView(true);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("todos", JSON.stringify(updatedTasks));
    toast.success('Task deleted successfully!');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Completed') return task.isComplete;
    if (filter === 'Incomplete') return !task.isComplete;
    return true; // All
  }).filter(task =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container mt-5'>
      <ToastContainer />
      <div>
        <div className='d-flex justify-content-between'>
          <h1 className='header-title'>Todo</h1>
          <button
            type="button"
            className="btn btn-style"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add
          </button>
        </div>
        <div>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {isEditing ? 'Edit Task' : 'Add Task'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <form>
                    <div className='mt-3'>
                      <input
                        type='text'
                        name='task'
                        className='form-control'
                        placeholder='Enter Task'
                        value={formData.task}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mt-3'>
                      <textarea
                        name='taskDetails'
                        className='form-control txt-area'
                        placeholder='Enter Task Details'
                        value={formData.taskDetails || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='mt-3'>
                      <input
                        type='date'
                        name='date'
                        value={formData.date}
                        onChange={handleChange}
                        className='form-control'
                        placeholder='Select Date'
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-style1"
                    data-bs-dismiss="modal"
                    onClick={handleClick}
                  >
                    {isEditing ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='todo-containers'>
      <Pages setFilter={setFilter} />
      </div>

      <div className='mt-3'>
        <input
          type='text'
          className='form-control'
          placeholder='Search tasks...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='mt-5'>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div className='card-stl' key={task.id}>
              <div className='d-flex justify-content-between'>
                <div className='d-flex gap-3'>
                  <input
                    type='checkbox'
                    checked={task.isComplete}
                    onChange={() => handleCheckboxChange(task.id)}
                  />
                  <div>
                    <h5 className='justified-text'>{task.task}</h5>
                    <h6 className='justified-text'>{task.date}</h6>
                  </div>
                </div>
                <div className='d-flex gap-3'>
                  <GoPencil className='text-info fs-3' onClick={() => handleEdit(task)} />
                  <FaEye type="button"  data-bs-toggle="modal" data-bs-target="#exampleModal12" className='text-info fs-3' onClick={() => handleView(task.id)} />
                  <FiTrash className='text-danger fs-3' onClick={() => handleDelete(task.id)} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {isEditing ? 'Edit Task' : 'Add Task'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className='mt-3'>
                    <input
                      type='text'
                      name='task'
                      className='form-control'
                      placeholder='Enter Task'
                      value={formData.task}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='mt-3'>
                    <textarea
                      name='taskDetails'
                      className='form-control txt-area'
                      placeholder='Enter Task Details'
                      value={formData.taskDetails}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='mt-3'>
                    <input
                      type='date'
                      name='date'
                      value={formData.date}
                      onChange={handleChange}
                      className='form-control'
                      placeholder='Select Date'
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-style1"
                  onClick={handleClick}
                >
                  {isEditing ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


{isView ? <>

<div>

  <div className="modal fade" id="exampleModal12" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">Task FullView</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
        <div>
        <h5 className='fw-bold'>Task</h5>
        <p>{single.task}</p>
        </div>
        <div>
        <h5 className='fw-bold'>Description</h5>
        <p>{single.taskDetails}</p>
        </div>
        <div>
        <h5 className='fw-bold'>Date</h5>
        <p>{single.date}</p>
        </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        
        </div>
      </div>
    </div>
  </div>
</div>

</>:null}


    </div>
  );
};

export default Todo;






