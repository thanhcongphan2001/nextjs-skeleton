import { redirect } from 'next/navigation';

function MainPage() {
	redirect(`/map/embed`);
	return null;
}

export default MainPage;
