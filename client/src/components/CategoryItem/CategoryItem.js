import React from 'react';

const CategoryItem = ({ item, category }) => {

    let color;
    if (category === 'Criteria') {
        color = '#46c35a';
    } else if (category === 'Interests') {
        color = '#64c7ff';
    }

    return (
        <div style={{
            border: '1px', // Change to the color you want
            borderRadius: '25px', // Rounded corners
            padding: '5px 10px', // Space around the text
            display: 'flex', // To display inline
            backgroundColor: color,
            minWidth: '100px',
            height: '30px',
            width: 'fit-content',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bolder' // Change to the color you want
        }}>
            {item}
        </div>
    );
};

export default CategoryItem;