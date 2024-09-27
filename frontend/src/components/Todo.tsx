import { useState, useEffect } from "react";
type Task = {
  task: string;
};

const Todo = () => {
  const [todo, setTodo] = useState(""); // for add input value
  const [data, setData] = useState<Task[]>([]);  //for storing data after getting from api fetch

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/fetchAllTasks");
        const result = await response.json();
        setData(result); 
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  //for post new task
  const handleSubmit = async (e: any ) => {
    e.preventDefault();
    if (!todo) {
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: todo }),
      });

      if (response.ok) {
        const newTask = { task: todo };
        setData([...data, newTask]); // Update the local state with the new task
        setTodo(""); // Clear the input field
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  //for delete all tasks
  const deleteAllTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/deleteAllTasks", {
        method: "DELETE",
      });

      if (response.ok) {
        setData([]); // Clear the state
      } else {
        console.error("Failed to delete tasks.");
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  return (
    <div className="md:border py-4 px-7 rounded-lg flex flex-col gap-y-6">
      <div className="flex items-center gap-6">
        <img src="/icons8-notes-app 1.png" alt="" className="w-20" />
        <h1 className="font-extrabold text-3xl">Note App</h1>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="flex gap-4 md:flex-row flex-col">
          <input
            type="text"
            className="border outline-none md:w-[400px] h-20 rounded-xl text-2xl pl-5"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="New Note..."
            required
          />
          <button
            type="submit"
            className="flex items-center gap-3 bg-[#92400E] px-5 py-3 rounded-xl text-2xl font-bold text-white"
          >
            <img src="/plus-circle 1.png" alt="" />
            Add
          </button>
        </form>
      </div>

      <div>
        <div className="flex justify-between">
        <h1 className="font-extrabold text-3xl">Notes</h1>
        {data?.length ? (
          <div>
            <button
            onClick={deleteAllTasks}
            className="bg-red-700 text-white px-4 py-2 rounded-lg text-xl"
          >
            {`${data.length > 1 ? "Delete All" : "Delete"}`}
          </button>
          </div>
        ) : (
          null
        )}
       
        </div>
        
        <div className="">
          {data.length ? (
            <div
              className={`pt-5 ${
                data.length > 4 ? "h-[350px] overflow-y-scroll scrollbar-custom" : "auto"
              }`}
            >
              {data.map((item:any, i) => (
                <div
                  key={i}
                  className="border border-l-0 border-r-0 py-4 text-2xl flex flex-row gap-3"
                >
                  <p>{i + 1}.</p>
                  <p>{item.task}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <p>No Note Available!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
