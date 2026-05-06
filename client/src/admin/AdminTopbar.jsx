import { Clock4 } from 'lucide-react';
import LiveDate from '../components/ui/LiveDate'

const AdminTopbar = () => {
    return (
        <div className="sticky top-0 z-50 px-7.5 py-6.25 border-4 border-l-0 border-mc-primary bg-mc-green-light ">
            <div className='flex items-center gap-2'>
                <Clock4 size={20}/>
                <LiveDate />
            </div>
        </div>
    )
}
export default AdminTopbar