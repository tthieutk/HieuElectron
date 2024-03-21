
import './Box.scss'

export const BoxApprove = () => {
    return (
        <div className='box-approve'>
            <div className='box-approve--content'>
                <div className='box-approve--top'>承認ルート</div>
                <div className='box-approve--center'>
                    <span className='box-approve--tag'>承認者：齋藤社長</span><span className='box-approve--tag'>共有者：総務</span>
                </div>
            </div>
            <div className='box-approve--bottom'>
                <a href="">+ 承認ルートを編集</a>
            </div>
        </div>
    )
}