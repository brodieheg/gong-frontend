function Deals({userDeals, handleClick}) {
    
    if(userDeals.length > 0) {
        console.log('user deals!!!')
        return(
            <>
            <h3>You Have Wins to Celebrate!!</h3>
            {userDeals.map( deal => {
                return (
                    <p 
                    id={deal.id} key={deal.id}>{deal.account}, ${deal.arr}
                    <button style={{marginLeft: '2em'}}onClick={handleClick}>Ring the Gong!</button>
                    </p>
                    )
            })}
            </>
        )
    }
    else {
        return(
            <p>You don't have any deals to ring for right now. Get after it and come back here to celebrate!</p>
        )
    }
}

export default Deals