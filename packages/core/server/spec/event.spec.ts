import {TestDto} from "./test.dto";
import {OnNet, Payload} from "../decorators";
import {Testing} from "../testing/manager";



test("event validation", () => {
class HandlerClass {
    @OnNet("test")
    public eventHandler(@Payload() pload: TestDto) {
        expect(pload).toBeInstanceOf(TestDto)
    }
}
new HandlerClass()
    Testing.emitNetEventWithSource("test", 0, {
        numberField: 10,
        strField: "hello",
        boolField: true
    })
})