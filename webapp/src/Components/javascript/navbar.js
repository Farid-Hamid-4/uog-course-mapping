const navbar = (currActive) => {

    const nav_item = 'nav-item nav-link';
    let query_item = nav_item;
    let search_item = nav_item;
    let programGraph_item = nav_item;
    let majorGraph_item = nav_item;
    
    if (currActive === '/query') query_item = query_item.concat(" active");
    else if (currActive === '/search') search_item = search_item.concat(" active");
    else if (currActive === '/programGraph') programGraph_item = programGraph_item.concat(" active");
    else if (currActive === '/majorGraph') majorGraph_item = majorGraph_item.concat(" active");

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-secondary padding">
                <a className="navbar-brand padding" href="/query">
                    <img src={require('../images/Team6_Logo.png')} width="60" height="60" alt="T6Logo" className="d-inline-block align-top" />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end nav-pills" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className={query_item} href="/query">Query</a>
                        <a className={search_item} href="/search">Search</a>
                        <a className={programGraph_item} href="/programGraph">Program Graph</a>
                        <a className={majorGraph_item} href="/majorGraph">Major Graph</a>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default navbar


