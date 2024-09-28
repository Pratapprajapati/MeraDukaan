const isShopOpen = (startTime, endTime) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();  // Convert to minutes

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTimeInMinutes = startHours * 60 + startMinutes;
    const endTimeInMinutes = endHours * 60 + endMinutes;

    return currentTime >= startTimeInMinutes && currentTime <= endTimeInMinutes;
};

export default isShopOpen