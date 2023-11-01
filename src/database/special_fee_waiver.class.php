<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class special_fee_waiver extends \cenozo\database\record
{
  /**
   * Determines which reqn an applicant has applied this special fee waiver to
   * @param database\user $db_user
   * @return database\reqn
   */
  function get_applied_reqn_by_user( $db_user )
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn.special_fee_waiver_id', '=', $this->id );
    $modifier->where( 'reqn.user_id', '=', $db_user->id );
    $reqn_list = $reqn_class_name::select_objects( $modifier );
    return 0 < count( $reqn_list ) ? current( $reqn_list ) : NULL;
  }
}
