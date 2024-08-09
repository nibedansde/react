import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL } from "../constants";

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();

    const visibleTodos = useMemo(
        () =>
            todos.filter((todo) => {
                if (route === "/active") return !todo.completed;
                if (route === "/completed") return todo.completed;
                return todo;
            }),
        [todos, route]
    );

    const toggleAll = useCallback(
        (e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }),
        [dispatch]
    );

    // Determine the last three completed tasks
    const lastCompleted = useMemo(() => {
        return todos
            .filter((todo) => todo.completed)
            .sort((a, b) => b.completedTime - a.completedTime)
            .slice(0, 3)
            .map((todo) => todo.id);
    }, [todos]);

    return (
        <main className="main" data-testid="main">
            {visibleTodos.length > 0 ? (
                <div className="toggle-all-container">
                    <input
                        className="toggle-all"
                        type="checkbox"
                        data-testid="toggle-all"
                        checked={visibleTodos.every((todo) => todo.completed)}
                        onChange={toggleAll}
                    />
                    <label className="toggle-all-label" htmlFor="toggle-all">
                        Toggle All
                    </label>
                </div>
            ) : null}
            <ul className={classnames("todo-list")} data-testid="todo-list">
                {visibleTodos.map((todo, index) => (
                    <Item
                        todo={todo}
                        key={todo.id}
                        dispatch={dispatch}
                        index={index}
                        lastCompleted={lastCompleted}
                    />
                ))}
            </ul>
        </main>
    );
}
