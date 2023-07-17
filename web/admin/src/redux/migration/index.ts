const migrations = {
    0: (state: any) => {
        // migration clear out device state
        return {
            ...state,
            app: {
                ...state.app,
                message: {
                    HOMEPAGE: 9
                }
            }
        }
    }
}

export default migrations