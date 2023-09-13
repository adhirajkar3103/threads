import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary'

const getFeedPosts = async(req,res)=>{
    try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

const getPost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(400).json({error:'Post does not exist'})
        res.status(200).json({message:'Post found',post})
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log('Error in createPost '+error.message)
    }
}

const createPost = async (req,res)=>{
    try {
        const {postedBy,text} = req.body;
		let {img} = req.body
        if(!postedBy || !text) return res.status(400).json({error:'postedBy or text missing'})

        const user = await User.findById(postedBy);
        if(!user) return res.status(404).json({error:'User not found'})
        if(req.user._id.toString() !== postedBy.toString()) return res.status(400).json({error:'Unauthorized'})
        const maxLen=500
        if(text.length>maxLen) return res.status(400).json({error:`Only ${maxLen} characters allowed`})

		if(img){
			const uploadResponse = await cloudinary.uploader.upload(img);
			img = uploadResponse.secure_url;
		}

        const newPost  = new Post({postedBy,text,img})
        await newPost.save();
        res.status(200).json({message:'Post created',newPost})
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log('Error in createPost '+error.message)
    }
}

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


export {createPost,getPost,deletePost,likeUnlikePost,replyToPost,getFeedPosts,getUserPosts}