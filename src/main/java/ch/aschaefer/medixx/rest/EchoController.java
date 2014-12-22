package ch.aschaefer.medixx.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author aschaefer
 * @since 19.12.14.
 */
@RestController
public class EchoController {

    @RequestMapping("/echo")
    public String echo() {
        return "HelloWorld!";
    }
}
