import React from 'react';
import './App.css';
import {Todolist} from './Todolist';
import AddItemForm from "./AddItemForm";
import {AppBar, Container, Grid, Paper} from '@material-ui/core';
import {Toolbar} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    deleteTodolistAC,
} from "./state/todolistsReducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC} from "./state/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    title: string
    filter: FilterValuesType
    id: string
};

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    // hooks from react-redux
    const dispatch = useDispatch();
    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);


    // Todolist Callbacks
    const addTodolist = (newTodolistTitle: string) => {
        const action = addTodolistAC(newTodolistTitle);
        dispatch(action);
    };

    const deleteTodolist = (todolistId: string) => {
        const action = deleteTodolistAC(todolistId);
        dispatch(action);
    };

    const changeTodolistTitle = (todolistId: string, changedTodolistTitle: string) => {
        dispatch(changeTodolistTitleAC(todolistId, changedTodolistTitle))
    }

    const changeTodolistFilter = (todolistId: string, newFilter: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(todolistId, newFilter))
    }

    // Tasks Callbacks
    const addTask = (title: string, todolistId: string) => {
        dispatch(addTaskAC(todolistId, title))
    }

    const deleteTask = (taskId: string, todolistId: string) => {
        dispatch(deleteTaskAC(todolistId, taskId))
    }

    const changeTaskTitle = (todolistId: string, taskId: string, changedTaskTitle: string) => {
        dispatch(changeTaskTitleAC(todolistId, taskId, changedTaskTitle))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(todolistId, taskId, isDone))
    }

    // Map Todolists
    let todolistElements = todolists.map(todolist => {

        let tasksForTodolist = tasks[todolist.id];
        if (todolist.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => !t.isDone);
        }
        if (todolist.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone);
        }

        return (
            <Grid key={todolist.id} item>
                <Paper elevation={5} variant={"elevation"} style={{padding: '20px'}}>
                    <Todolist id={todolist.id} title={todolist.title} tasks={tasksForTodolist}
                              deleteTask={deleteTask} changeTodolistFilter={changeTodolistFilter} addTask={addTask}
                              changeTaskStatus={changeTaskStatus} filter={todolist.filter}
                              deleteTodolist={deleteTodolist}
                              changeTodolistTitle={changeTodolistTitle} changeTaskTitle={changeTaskTitle}/>
                </Paper>
            </Grid>
        )
    })

    // JSX
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid style={{margin: '20px 0'}}
                      container
                    // direction="row"
                    // justify="center"
                    // alignItems="center"
                >
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={5}>
                    {todolistElements}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
