import React from 'react'
import './Post.css'
import Comment from '../../img/comment.png'
import Share from '../../img/share.png'
import Heart from '../../img/like.png'
import NotLike from '../../img/notlike.png'


function Post({data,id}) {
  console.log(data,'data')
  return (
    <div className="Post" key={data?._id}>
         <img src={data?.images} alt="PostImage" />

        <div className="postReact">
            <img src={data?.likes? Heart:NotLike} alt="" style={{width:'30px',height:'30px'}} />
            <img src={Comment} alt="" />
            <img src={Share} alt="" />
        </div>

       <span style={{color:'var(--gray) ',fontSize:'13px'}}>{data?.likes?.length? data.likes.length : 0} likes</span> 

       <div className='details'>
            <span><b>{data?.userId?.username} </b></span>
            <span> {data.desc}</span>
       </div>
    </div>
  )
}

export default Post
