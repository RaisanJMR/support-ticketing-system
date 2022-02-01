import { AiOutlineQuestionCircle, AiFillTags } from 'react-icons/ai'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>

      <section className='heading'>
        <h1>What do you need help with</h1>
        <p>Please choose an option below</p>
      </section>

      <Link to='/new-ticket' className='btn btn-reverse btn-block'>
        <AiOutlineQuestionCircle /> Create new ticket
      </Link>
      <Link to='/tickets' className='btn btn-block'>
        <AiFillTags /> View my tickets
      </Link>

    </>
  )
}

export default Home
