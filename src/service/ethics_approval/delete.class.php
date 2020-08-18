<?php
/**
 * delete.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\ethics_approval;
use cenozo\lib, cenozo\log, magnolia\util;

class delete extends \cenozo\service\delete
{
  /**
   * Extends parent method
   */
  protected function validate()
  {
    parent::validate();

    $db_role = lib::create( 'business\session' )->get_role();
    $db_ethics_approval = $this->get_leaf_record();
    $db_language = $db_ethics_approval->get_reqn()->get_language();

    if( 'applicant' == $db_role->name )
    {
      throw lib::create( 'exception\notice',
        'fr' == $db_language->code ?
        'L’approbation éthique ne peut plus être supprimée' :
        'You can no longer remove this ethics approval file.',
        __METHOD__
      );
    }
  }
}
