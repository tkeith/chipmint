
import Navbar from './components/navbar'
import DataGrid from './components/dataGrid'

export default function Homepage() {
  return (
    <>
    <Navbar />
    <div className="bg-emerald-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-3xl mx-auto">
        <DataGrid/>
      </div>
    </div>
    </>
  )
}
