import { useEffect } from "react";
import { Image, Flex, Typography} from "antd";

const {Title, Paragraph} = Typography;

function HomePage() {

    useEffect(()=>{
        document.title = "Home Page";
    },[])

    return(
        <>
            <Flex className="h-screen" justify="center" align="center">
                <Flex style={{width: '19rem', textAlign: 'center'}} vertical>
                    <Image 
                        src="https://todoist.b-cdn.net/assets/images/55afb376fba13aaa2331a46361ea7cf6.png"
                        preview={false}
                    />
                    <Title level={5}>Your peace of mind is priceless</Title>
                    <Paragraph>Well done! All your tasks are organized in the right place.</Paragraph>
                </Flex>
            </Flex>
        </>
    )
}

export default HomePage;