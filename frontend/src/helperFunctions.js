//_____Date_TIME_FORMATING_____
export const formattedDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {hour: 'numeric', minute: 'numeric'}
    return date.toLocaleDateString() + " · " + date.toLocaleTimeString(undefined, options);
}
