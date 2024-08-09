import { ADD_ITEM, UPDATE_ITEM, REMOVE_ITEM, TOGGLE_ITEM, REMOVE_ALL_ITEMS, TOGGLE_ALL, REMOVE_COMPLETED_ITEMS } from "./constants";

function nanoid(size = 21) {
    const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    let id = "";
    let i = size;
    while (i--) {
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}

const initialState = [];

export const todoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return [
                ...state,
                {
                    id: nanoid(),
                    title: action.payload.title,
                    completed: false,
                    addedTime: Date.now(),
                    completedTime: null,
                    colorChanged: false,  // Initialize colorChanged flag
                },
            ];
        case REMOVE_ITEM:
            return state.filter((todo) => todo.id !== action.payload.id);
        case UPDATE_ITEM:
            return state.map((todo) =>
                todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
            );
        case TOGGLE_ITEM:
            const updatedState = state.map((todo) =>
                todo.id === action.payload.id
                    ? {
                          ...todo,
                          completed: !todo.completed,
                          completedTime: todo.completed ? null : Date.now(),
                      }
                    : todo
            );
            const lastCompleted = updatedState
                .filter((todo) => todo.completed)
                .sort((a, b) => b.completedTime - a.completedTime)
                .slice(0, 3)
                .map((todo) => todo.id);
            return updatedState.map((todo) =>
                lastCompleted.includes(todo.id)
                    ? { ...todo, isLastCompleted: lastCompleted.indexOf(todo.id) + 1 }
                    : { ...todo, isLastCompleted: 0 }
            );
        case REMOVE_ALL_ITEMS:
            return [];
        case TOGGLE_ALL:
            const isAllCompleted = state.every((todo) => todo.completed);
            return state.map((todo) => ({ ...todo, completed: !isAllCompleted }));
        case REMOVE_COMPLETED_ITEMS:
            return state.filter((todo) => !todo.completed);
        default:
            return state;
    }
};
