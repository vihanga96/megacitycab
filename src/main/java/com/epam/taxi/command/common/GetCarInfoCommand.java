package com.epam.taxi.command.common;

import com.epam.taxi.Path;
import com.epam.taxi.command.Command;
import com.epam.taxi.db.dao.CarDAO;
import com.epam.taxi.db.dao.OrderDAO;
import com.epam.taxi.db.entity.Account;
import com.epam.taxi.db.entity.Car;
import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Command allows to get information about car(s) in order.
 *
 * @author M.-B.Vynnytskyi
 */
public class GetCarInfoCommand extends Command {
    private static final long serialVersionUID = 8184403039606311780L;
    private static final Logger LOGGER = Logger.getLogger(GetCarInfoCommand.class);

    @Override
    public Path execute(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        LOGGER.info("Command starts");
        String pageUrl = Path.PAGE_ERROR_PAGE;

        OrderDAO orderDAO = new OrderDAO();
        List<Integer> carsId = new ArrayList<>();

        HttpSession session = request.getSession();
        String locale = (String) session.getAttribute("locale");
        Account account = (Account) session.getAttribute("account");

        String orderId = request.getParameter("orderId");

        //If the order ID is not null, return the car info page depending on the role of the account
        if (!isNull(orderId)) {
            carsId = orderDAO.getCarIdFromOrder(Integer.parseInt(orderId));
            pageUrl = account.getRole() ? Path.PAGE_ORDER_CARS : Path.PAGE_CAR_INFO;

            LOGGER.info("Received information about the cars in the order " + orderId);
        }

        request.setAttribute("orderId", orderId);
        request.setAttribute("carsList", getCarList(carsId, locale));

        LOGGER.info("Command finished");
        return new Path(pageUrl, false);
    }

    /**
     * Method returns list of cars of the order
     *
     * @param carsId carsId cars ID of the order
     * @param locale car description language
     * @return List of cars
     */
    private List<Car> getCarList(List<Integer> carsId, String locale) {
        CarDAO carDAO = new CarDAO();
        List<Car> carsList = new ArrayList<>();

        for (Integer carID : carsId) {
            carsList.add(carDAO.getCar(carID, locale));
        }

        return carsList;
    }
}
