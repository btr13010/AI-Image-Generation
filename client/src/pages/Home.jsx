import React, {useState, useEffect} from 'react';

import {Loader, Card, FormField} from '../components';

// Render the series of Posts or a message if there are no posts
const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>
      {title}
    </h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeOut, setSearchTimeOut] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      // Run a Get request to the server to get all the posts
      const response = await fetch('https://dall-e-wauu.onrender.com/api/v1/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {  
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
      
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect run when the page is navigated to and fetches all the posts to allPosts
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);

    setSearchText(e.target.value);

    setSearchTimeOut(
      setTimeout(() => {
        // Search over allPosts for the post with prompt or name that matches the search text
        const searchResults = allPosts.filter((post) => post.prompt.toLowerCase().includes(searchText.toLowerCase()) || post.name.toLowerCase().includes(searchText.toLowerCase()));
        setSearchResults(searchResults);
      }, 500)
    );
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          The Community Showcase
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Browse through a collection of imaginative and visually stunning images generated by DALL-E AI
        </p>
      </div>

      <div className='mt-16'>
        <FormField 
          labelName="Search Posts"
          placeholder="Search by prompt or name"
          type='text'
          name='text'
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                Showing results for <span className='text-[#222328]'>{searchText}</span>
              </h2>
            )}

            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText ? (
                <RenderCards 
                  data={searchResults}
                  title='No search results found' 
                />
              ) : (
                <RenderCards 
                  data={allPosts} 
                  title='No posts found' 
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home