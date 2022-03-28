const cardgen = (courseName, courseDescription) => {
        
    // Column adds left and right lines
    let column = document.createElement('div');
    
    // Card elements, the card, its header, and its text content inside body
    let card = document.createElement('div');
    let header = document.createElement('div');  
    let body = document.createElement('div');
    let text = document.createElement('div');

    // Add classes to the divs
    column.classList.add("col");
    column.classList.add("card-padding");
    card.classList.add("card");
    header.classList.add("card-header");
    body.classList.add("card-body");
    text.classList.add("card-text");

    header.textContent = courseName;
    text.textContent = courseDescription;

    // Append order
    card.append(header);
    body.append(text);
    card.append(body);
    column.append(card);
    return (column);
}

export default cardgen