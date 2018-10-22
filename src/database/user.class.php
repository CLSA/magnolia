<?php
/**
 * user.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, util;

/**
 * user: record
 */
class user extends \cenozo\database\user
{
  /**
   * Returns whether a user has signed up for the newsletter (checking applicant.newsletter)
   */
  public function get_newsletter()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'applicant' );
    $select->add_column( 'newsletter' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'user_id', '=', $this->id );
    return (boolean) static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
  }

  /**
   * Sets whether a user should be signed up for the newsletter (setting applicant.newsletter)
   * @param boolean $newsletter
   */
  public function set_newsletter( $newsletter )
  {
    return static::db()->execute( sprintf(
      'REPLACE INTO applicant( user_id, newsletter ) VALUES ( %s, %s )',
      static::db()->format_string( $this->id ),
      static::db()->format_string( $newsletter )
    ) );
  }
}
