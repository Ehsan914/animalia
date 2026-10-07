import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import { excerpt, postDate, postFields, postHref, readLabel } from "./blogText"

// One post on the blog list and under "More from the blog".
export default function PostCard({ post, lang }) {
    const { title, content, category } = postFields(post, lang)

    return (
        <Link className="post-card" to={postHref(post, lang)}>
            <div className="post-meta">
                <span className="post-cat">{category}</span>
                <span>{postDate(post.createdAt, lang)}</span>
            </div>
            <h2 className="post-title">{title}</h2>
            <p className="post-excerpt">{excerpt(content)}</p>
            <div className="post-foot">
                <span>{post.author} · {readLabel(content, lang)}</span>
                <Icon name="arrow-right" />
            </div>
        </Link>
    )
}
