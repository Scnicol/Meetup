//_____Date_TIME_FORMATING_____
export const formattedDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {hour: 'numeric', minute: 'numeric'}
    return date.toLocaleDateString() + " · " + date.toLocaleTimeString(undefined, options);
}


//_____IMAGE_DISPLAY_______
export const imageDisplay = (images) => {
    const image = images?.[0]?.url ?? 'image.png';
    return image;
}
