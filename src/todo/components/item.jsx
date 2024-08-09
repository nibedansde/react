import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";
import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

// Memoized Item component for rendering individual tasks
export const Item = memo(function Item({ todo, dispatch, index, lastCompleted }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id, addedTime, completedTime, colorChanged } = todo;
    const [color, setColor] = useState(colorChanged ? 'black' : 'red');
    const [timeRemaining, setTimeRemaining] = useState(colorChanged ? 0 : 15); // Countdown for color change

    useEffect(() => {
        // Run color transition logic only if task is newly added
        if (!completed && !colorChanged) {
            const interval = setInterval(() => {
                setTimeRemaining((prev) => Math.max(prev - 1, 0)); // Decrease every second
            }, 1000);

            const timer = setTimeout(() => {
                setColor('black');  // Change color to black after 5 seconds
                dispatch({ type: UPDATE_ITEM, payload: { id, colorChanged: true } }); // Update state
                setTimeRemaining(0);  // Stop the countdown
            }, 15000);

            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, [completed, colorChanged, dispatch, id]);

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch, id]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch, id]);
    const updateItem = useCallback((id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }), [dispatch, id]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (title) => {
            if (title.length === 0) removeItem(id);
            else updateItem(id, title);
            setIsWritable(false);
        },
        [id, removeItem, updateItem]
    );

    const getCompletedColor = () => {
        if (lastCompleted[0] === id) return 'green';
        if (lastCompleted[1] === id) return 'magenta';
        if (lastCompleted[2] === id) return 'yellow';
        return 'grey';
    };

    // Determine the color for the entire item (task name, marker, etc.)
    const getItemColor = () => (completed ? getCompletedColor() : color);

    // Calculate progress percentage for the task item countdown
    const progress = ((15 - timeRemaining) / 15) * 100;

    return (
        <li
            className={classnames({ completed })}
            data-testid="todo-item"
            style={{
                color: getItemColor(),
                position: 'relative',
                border: `2px solid ${getItemColor()}`, // Apply color to <li> border
                padding: '15px',
                borderRadius: '8px', // Add border-radius for rounded edges
                margin: '10px 0', // Add margin for spacing between items
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                backgroundColor: completed ? 'rgba(240, 240, 240, 0.9)' : 'white', // Background color
                transition: 'all 0.3s ease', // Smooth transitions
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            <div className="progress" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress}%`,
                background: 'rgba(0, 0, 0, 0.1)', // Light overlay indicating progress
                zIndex: 0,
                transition: 'width 1s linear'
            }} />
            <div className="view" style={{ display: 'flex', alignItems: 'center', zIndex: 1, width: '100%' }}>
                {isWritable ? (
                    <Input
                        onSubmit={handleUpdate}
                        label="Edit Todo Input"
                        defaultValue={title}
                        onBlur={handleBlur}
                    />
                ) : (
                    <>
                        <input
                            className="toggle"
                            type="checkbox"
                            data-testid="todo-item-toggle"
                            checked={completed}
                            onChange={toggleItem}
                            style={{
                                width: '120px',
                                height: '20px',
                                borderColor: getItemColor(), // Set the border color of the marker
                                borderRadius: '50%', // Circular checkbox
                                backgroundColor: completed ? getItemColor() : 'transparent', // Background fill for completed
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease, border-color 0.3s ease',
                                marginRight: '15px'
                            }}
                        />
                        <label
                            data-testid="todo-item-label"
                            onDoubleClick={handleDoubleClick}
                            style={{ color: getItemColor(), flex: 1, zIndex: 1, cursor: 'pointer' }} // Ensure text matches item color
                            onClick={toggleItem} // Allow toggle on label click
                        >
                            {title}
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1, marginLeft: '15px', fontSize: '0.55em', color: getItemColor() }}>
                            <span><strong>{addedTime ? `Added: ${new Date(addedTime).toLocaleTimeString("en-US")}` : ''}</strong>
                            </span>
                            <span>
                               <strong>{completedTime ? `Completed: ${new Date(completedTime).toLocaleTimeString("en-US")}` : ''}</strong> 
                            </span>
                            {!completed && !colorChanged && timeRemaining > 0 && (
                                <span style={{ marginTop: '5px' }}>
                                    <strong>Changes in {timeRemaining}s</strong>
                                </span>
                            )}
                        </div>
                        <button

                            data-testid="todo-item-button"
                            onClick={removeItem}
                            style={{
                                backgroundColor: color,
                                border: color,
                                color: "white", // Ensure the icon matches the item color
                                cursor: 'pointer',
                                fontSize: '0.86em',
                                marginLeft: '115px',
                                zIndex: 1
                            }}
                        >
                       Remove
                        </button>
                    </>
                )}
            </div>
        </li>
    );
});
