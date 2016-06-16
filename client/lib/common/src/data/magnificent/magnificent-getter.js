export function getAuth(state, team) {
    return state.get(team, null);
}
